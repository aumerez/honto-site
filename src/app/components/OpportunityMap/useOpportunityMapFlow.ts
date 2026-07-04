"use client";

import { useEffect, useReducer } from "react";
import { EMPTY_TECH_STACK, type OpportunityMapSubmission } from "./schema";
import {
  canTransition,
  completedCount,
  nextState,
  prevState,
  progressFor,
  sectionCompletion,
  type FlowState,
  type SectionKey,
} from "./state";
import { clearFlow, freshAnswers, loadFlow, saveFlow } from "./storage";

type State = {
  flowState: FlowState;
  answers: OpportunityMapSubmission;
  /** Saved progress to offer on the landing screen (null = none). */
  resumeState: FlowState | null;
  hydrated: boolean;
};

type Action =
  | { type: "hydrate"; state: FlowState; answers: OpportunityMapSubmission }
  | { type: "hydrateEmpty" }
  | { type: "start" }
  | { type: "resume" }
  | { type: "next" }
  | { type: "back" }
  | { type: "goTo"; to: FlowState }
  | { type: "skipTech" }
  | { type: "patch"; key: SectionKey; patch: Record<string, unknown> }
  | { type: "reset" };

function initial(): State {
  return {
    flowState: "LANDING",
    answers: freshAnswers(),
    resumeState: null,
    hydrated: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return {
        flowState: "LANDING",
        answers: action.answers,
        resumeState: action.state !== "LANDING" ? action.state : null,
        hydrated: true,
      };

    case "hydrateEmpty":
      return { ...state, hydrated: true };

    case "start":
    case "resume": {
      const to =
        action.type === "resume" && state.resumeState
          ? state.resumeState
          : nextState("LANDING", state.answers.techSkipped);
      return to
        ? { ...state, flowState: to, resumeState: null }
        : { ...state, resumeState: null };
    }

    case "next": {
      const to = nextState(state.flowState, state.answers.techSkipped);
      return to ? { ...state, flowState: to } : state;
    }

    case "back": {
      const to = prevState(state.flowState, state.answers.techSkipped);
      return to ? { ...state, flowState: to } : state;
    }

    case "goTo":
      return canTransition(
        state.flowState,
        action.to,
        state.answers.techSkipped
      )
        ? { ...state, flowState: action.to }
        : state;

    case "skipTech": {
      if (state.flowState !== "SYSTEM_LANDSCAPE") return state;
      return {
        ...state,
        answers: { ...state.answers, techSkipped: true, techStack: null },
        flowState: "CONTACT_GATE",
      };
    }

    case "patch": {
      if (action.key === "techStack") {
        const base = state.answers.techStack ?? EMPTY_TECH_STACK;
        return {
          ...state,
          answers: {
            ...state.answers,
            techStack: { ...base, ...action.patch },
            techSkipped: false,
          },
        };
      }
      const merged = { ...state.answers[action.key], ...action.patch };
      const next = {
        ...state.answers,
        [action.key]: merged,
      } as OpportunityMapSubmission;
      // Carry the company name from business context onto the contact record so
      // it is never asked for twice.
      const answers =
        action.key === "company"
          ? {
              ...next,
              contact: {
                ...next.contact,
                company: (merged as { companyName?: string }).companyName ?? "",
              },
            }
          : next;
      return { ...state, answers };
    }

    case "reset":
      return {
        flowState: "LANDING",
        answers: freshAnswers(),
        resumeState: null,
        hydrated: true,
      };

    default:
      return state;
  }
}

export function useOpportunityMapFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  // Load any prior session after mount, surfacing it as a resume option.
  useEffect(() => {
    const loaded = loadFlow();
    if (loaded) {
      dispatch({
        type: "hydrate",
        state: loaded.state,
        answers: loaded.answers,
      });
    } else {
      dispatch({ type: "hydrateEmpty" });
    }
  }, []);

  // Persist after each change. Don't overwrite saved progress while parked on
  // the landing screen (the saved session is the resume target).
  useEffect(() => {
    if (!state.hydrated) return;
    if (state.flowState === "LANDING") return;
    saveFlow(state.flowState, state.answers);
  }, [state.flowState, state.answers, state.hydrated]);

  return {
    hydrated: state.hydrated,
    flowState: state.flowState,
    answers: state.answers,
    techSkipped: state.answers.techSkipped,
    hasSavedProgress: state.resumeState !== null,
    progress: progressFor(state.flowState, state.answers.techSkipped),
    completion: sectionCompletion(state.answers),
    completedSections: completedCount(state.answers),
    start: () => dispatch({ type: "start" }),
    resume: () => dispatch({ type: "resume" }),
    next: () => dispatch({ type: "next" }),
    back: () => dispatch({ type: "back" }),
    goTo: (to: FlowState) => dispatch({ type: "goTo", to }),
    skipTech: () => dispatch({ type: "skipTech" }),
    patch: (key: SectionKey, patch: Record<string, unknown>) =>
      dispatch({ type: "patch", key, patch }),
    startOver: () => {
      clearFlow();
      dispatch({ type: "reset" });
    },
  };
}
