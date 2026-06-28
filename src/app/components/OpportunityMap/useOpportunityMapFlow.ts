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

type Snapshot = { flowState: FlowState; answers: OpportunityMapSubmission };
type State = Snapshot & { hydrated: boolean };

type Action =
  | { type: "hydrate"; snapshot: Snapshot | null }
  | { type: "start" }
  | { type: "next" }
  | { type: "back" }
  | { type: "goTo"; to: FlowState }
  | { type: "skipTech" }
  | { type: "patch"; key: SectionKey; patch: Record<string, unknown> }
  | { type: "reset" };

function initial(): State {
  return { flowState: "LANDING", answers: freshAnswers(), hydrated: false };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.snapshot
        ? { ...action.snapshot, hydrated: true }
        : { ...state, hydrated: true };

    case "start": {
      if (state.flowState !== "LANDING") return state;
      const to = nextState("LANDING", state.answers.techSkipped);
      return to ? { ...state, flowState: to } : state;
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
      const section = state.answers[action.key];
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.key]: { ...section, ...action.patch },
        },
      };
    }

    case "reset":
      return { flowState: "LANDING", answers: freshAnswers(), hydrated: true };

    default:
      return state;
  }
}

export function useOpportunityMapFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  // Hydrate from a prior session (or start fresh) after mount.
  useEffect(() => {
    const loaded = loadFlow();
    dispatch({
      type: "hydrate",
      snapshot: loaded
        ? { flowState: loaded.state, answers: loaded.answers }
        : null,
    });
  }, []);

  // Persist after every change, once hydrated.
  useEffect(() => {
    if (!state.hydrated) return;
    saveFlow(state.flowState, state.answers);
  }, [state.flowState, state.answers, state.hydrated]);

  return {
    hydrated: state.hydrated,
    flowState: state.flowState,
    answers: state.answers,
    techSkipped: state.answers.techSkipped,
    progress: progressFor(state.flowState, state.answers.techSkipped),
    completion: sectionCompletion(state.answers),
    completedSections: completedCount(state.answers),
    start: () => dispatch({ type: "start" }),
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
