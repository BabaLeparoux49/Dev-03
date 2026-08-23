"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { parseState, serializeState, STORAGE_KEY } from "@/lib/promptBuilder";
import type { CategoryId, WizardAnswers, WizardState } from "@/lib/types";

const emptyState: WizardState = {
  idea: "",
  categoryId: null,
  answers: {},
  extras: "",
};

type WizardContextValue = {
  state: WizardState;
  setIdea: (idea: string) => void;
  setCategory: (id: CategoryId) => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  replaceAnswers: (answers: WizardAnswers) => void;
  setExtras: (extras: string) => void;
  reset: () => void;
  hydrated: boolean;
};

const WizardContext = createContext<WizardContextValue | null>(null);

type Listener = () => void;
const listeners = new Set<Listener>();

/** In-memory cache — getSnapshot must return a stable reference. */
let cachedState: WizardState = emptyState;
let cacheReady = false;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function ensureCache() {
  if (cacheReady || typeof window === "undefined") return;
  cachedState =
    parseState(window.sessionStorage.getItem(STORAGE_KEY)) ?? emptyState;
  cacheReady = true;
}

function getSnapshot(): WizardState {
  ensureCache();
  return cachedState;
}

function getServerSnapshot(): WizardState {
  return emptyState;
}

function getHydratedSnapshot(): boolean {
  ensureCache();
  return true;
}

function getHydratedServerSnapshot(): boolean {
  return false;
}

function writeStore(next: WizardState) {
  cachedState = next;
  cacheReady = true;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, serializeState(next));
  }
  emit();
}

function updateStore(updater: (prev: WizardState) => WizardState) {
  writeStore(updater(cachedState));
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );

  const setIdea = useCallback((idea: string) => {
    updateStore((s) => ({ ...s, idea }));
  }, []);

  const setCategory = useCallback((id: CategoryId) => {
    updateStore((s) => ({
      ...s,
      categoryId: id,
      answers: {},
    }));
  }, []);

  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      updateStore((s) => ({
        ...s,
        answers: { ...s.answers, [questionId]: value },
      }));
    },
    [],
  );

  const replaceAnswers = useCallback((answers: WizardAnswers) => {
    updateStore((s) => ({ ...s, answers }));
  }, []);

  const setExtras = useCallback((extras: string) => {
    updateStore((s) => ({ ...s, extras }));
  }, []);

  const reset = useCallback(() => {
    cachedState = emptyState;
    cacheReady = true;
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    emit();
  }, []);

  const value = useMemo(
    () => ({
      state,
      setIdea,
      setCategory,
      setAnswer,
      replaceAnswers,
      setExtras,
      reset,
      hydrated,
    }),
    [
      state,
      setIdea,
      setCategory,
      setAnswer,
      replaceAnswers,
      setExtras,
      reset,
      hydrated,
    ],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
