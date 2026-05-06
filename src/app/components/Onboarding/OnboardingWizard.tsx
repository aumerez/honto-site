"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  EMPTY_ANSWERS,
  STEP_COUNT,
  type Answers,
  type Step1Company,
  type Step2Systems,
  type Step3Data,
  type Step4AI,
  type Step5Goals,
} from "./schema";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  type Step1Copy,
  type Step2Copy,
  type Step3Copy,
  type Step4Copy,
  type Step5Copy,
} from "./Steps";
import { Results, type ResultsCopy } from "./Results";

type WizardCopy = {
  stepLabel: string;
  back: string;
  next: string;
  submit: string;
  startOver: string;
  emailInvalid: string;
  phoneInvalid: string;
  step1: Step1Copy;
  step2: Step2Copy;
  step3: Step3Copy;
  step4: Step4Copy;
  step5: Step5Copy;
  results: ResultsCopy;
};

const STORAGE_KEY = "honto-onboarding-v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

type Persisted = { answers: Answers; step: number };

function loadFromStorage(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      answers: { ...EMPTY_ANSWERS, ...parsed.answers },
      step:
        typeof parsed.step === "number" &&
        parsed.step >= 1 &&
        parsed.step <= STEP_COUNT + 1
          ? parsed.step
          : 1,
    };
  } catch {
    return null;
  }
}

function isStep1Valid(s: Step1Company): boolean {
  return Boolean(
    s.companyName.trim() &&
    s.contactName.trim() &&
    EMAIL_RE.test(s.email) &&
    (!s.phone || PHONE_RE.test(s.phone)) &&
    s.industry &&
    s.companySize
  );
}

type WizardState = {
  answers: Answers;
  step: number;
  hydrated: boolean;
};

type WizardAction =
  | { type: "hydrate"; persisted: Persisted | null }
  | {
      type: "patch";
      key: keyof Answers;
      patch: Partial<Answers[keyof Answers]>;
    }
  | { type: "setStep"; step: number }
  | { type: "reset" };

const INITIAL_STATE: WizardState = {
  answers: EMPTY_ANSWERS,
  step: 1,
  hydrated: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "hydrate":
      return action.persisted
        ? { ...action.persisted, hydrated: true }
        : { ...state, hydrated: true };
    case "patch":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.key]: { ...state.answers[action.key], ...action.patch },
        },
      };
    case "setStep":
      return { ...state, step: action.step };
    case "reset":
      return { answers: EMPTY_ANSWERS, step: 1, hydrated: true };
    default:
      return state;
  }
}

export default function OnboardingWizard() {
  const { locale, t } = useLocale();
  const copy = (t.onboarding as { wizard: WizardCopy }).wizard;

  const [{ answers, step, hydrated }, dispatch] = useReducer(
    wizardReducer,
    INITIAL_STATE
  );
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch({ type: "hydrate", persisted: loadFromStorage() });
  }, []);

  function scrollToTop() {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, step } satisfies Persisted)
      );
    } catch {
      // localStorage may be unavailable or full — fail silently
    }
  }, [answers, step, hydrated]);

  function update<K extends keyof Answers>(key: K, patch: Partial<Answers[K]>) {
    dispatch({ type: "patch", key, patch });
  }

  function startOver() {
    dispatch({ type: "reset" });
    setSubmitted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    scrollToTop();
  }

  function submitAndShowResults() {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      console.log(
        "[onboarding] submitted (PR 2 — no API yet):",
        JSON.stringify(answers)
      );
    }
    scrollToTop();
  }

  function bookFollowUp() {
    const url = `/${locale}#contact`;
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  }

  if (submitted) {
    return (
      <div ref={containerRef} className="ob-wizard">
        <Results
          answers={answers}
          copy={copy.results}
          onBookFollowUp={bookFollowUp}
        />
        <div className="ob-results-footer ob-print-hide">
          <button type="button" className="ob-link-btn" onClick={startOver}>
            {copy.startOver}
          </button>
        </div>
      </div>
    );
  }

  const canAdvance = step === 1 ? isStep1Valid(answers.step1) : true;
  const isLast = step === STEP_COUNT;
  const stepLabel = copy.stepLabel
    .replace("{n}", String(step))
    .replace("{total}", String(STEP_COUNT));

  return (
    <div ref={containerRef} className="ob-wizard ob-print-hide">
      <div className="ob-progress">
        <span className="ob-progress-label">{stepLabel}</span>
        <progress
          className="ob-progress-bar"
          value={step}
          max={STEP_COUNT}
          aria-label={stepLabel}
        />
      </div>

      <form
        className="ob-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canAdvance) return;
          if (isLast) {
            submitAndShowResults();
          } else {
            dispatch({ type: "setStep", step: step + 1 });
            scrollToTop();
          }
        }}
      >
        {step === 1 && (
          <Step1
            values={answers.step1}
            update={(p) => update("step1", p)}
            copy={{
              ...copy.step1,
              emailInvalid: copy.emailInvalid,
              phoneInvalid: copy.phoneInvalid,
            }}
          />
        )}
        {step === 2 && (
          <Step2
            values={answers.step2}
            update={(p) => update("step2", p)}
            copy={copy.step2}
          />
        )}
        {step === 3 && (
          <Step3
            values={answers.step3}
            update={(p) => update("step3", p)}
            copy={copy.step3}
          />
        )}
        {step === 4 && (
          <Step4
            values={answers.step4}
            update={(p) => update("step4", p)}
            copy={copy.step4}
          />
        )}
        {step === 5 && (
          <Step5
            values={answers.step5}
            update={(p) => update("step5", p)}
            copy={copy.step5}
          />
        )}

        <div className="ob-actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              dispatch({ type: "setStep", step: Math.max(1, step - 1) });
              scrollToTop();
            }}
            disabled={step === 1}
          >
            {copy.back}
          </button>
          <button type="submit" className="btn primary" disabled={!canAdvance}>
            {isLast ? copy.submit : copy.next}
          </button>
        </div>
      </form>
    </div>
  );
}
