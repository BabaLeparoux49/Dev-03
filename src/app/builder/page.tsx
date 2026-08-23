"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionStep } from "@/components/QuestionStep";
import { useWizard } from "@/components/WizardProvider";
import { CATEGORIES } from "@/lib/categories";
import {
  getNextQuestion,
  getProgress,
  getVisibleQuestions,
  isFlowComplete,
} from "@/lib/questionFlows";
import type { CategoryId, Question } from "@/lib/types";

type Phase = "idea" | "category" | "questions" | "extras";

export default function BuilderPage() {
  const router = useRouter();
  const {
    state,
    setIdea,
    setCategory,
    setAnswer,
    replaceAnswers,
    setExtras,
    hydrated,
  } = useWizard();
  const [phase, setPhase] = useState<Phase>("idea");
  const [history, setHistory] = useState<string[]>([]);

  const currentQuestion = useMemo(() => {
    if (!state.categoryId) return null;
    return getNextQuestion(state.categoryId, state.answers);
  }, [state.categoryId, state.answers]);

  const progress = useMemo(() => {
    if (phase === "idea") return { current: 0, total: 4 };
    if (phase === "category") return { current: 1, total: 4 };
    if (phase === "questions" && state.categoryId) {
      const p = getProgress(state.categoryId, state.answers);
      return { current: 2 + p.current, total: 2 + p.total + 1 };
    }
    if (phase === "extras") {
      const base =
        state.categoryId != null
          ? getProgress(state.categoryId, state.answers).total
          : 0;
      return { current: 2 + base + 1, total: 2 + base + 1 };
    }
    return { current: 3, total: 4 };
  }, [phase, state.categoryId, state.answers]);

  if (!hydrated) {
    return (
      <div className="site-shell flex flex-1 items-center justify-center py-20 text-[var(--muted)]">
        Chargement…
      </div>
    );
  }

  function goQuestions(categoryId: CategoryId) {
    setCategory(categoryId);
    setHistory([]);
    setPhase("questions");
  }

  function answerCurrent(value: string | string[]) {
    if (!state.categoryId || !currentQuestion) return;
    const nextAnswers = { ...state.answers, [currentQuestion.id]: value };
    setAnswer(currentQuestion.id, value);
    setHistory((h) => [...h, currentQuestion.id]);
    const next = getNextQuestion(state.categoryId, nextAnswers);
    if (!next && isFlowComplete(state.categoryId, nextAnswers)) {
      setPhase("extras");
    }
  }

  function backFromQuestion() {
    if (history.length === 0) {
      setPhase("category");
      return;
    }
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    const rebuilt = { ...state.answers };
    delete rebuilt[last];
    if (state.categoryId) {
      const visibleIds = new Set(
        getVisibleQuestions(state.categoryId, rebuilt).map((q) => q.id),
      );
      for (const key of Object.keys(rebuilt)) {
        if (!visibleIds.has(key)) delete rebuilt[key];
      }
    }
    replaceAnswers(rebuilt);
  }

  return (
    <div className="site-shell flex flex-1 flex-col py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <ProgressBar
          current={progress.current}
          total={progress.total}
          label="Construction du prompt"
        />

        <div className="panel mt-6 fade-up">
          {phase === "idea" ? (
            <IdeaPhase
              idea={state.idea}
              onChange={setIdea}
              onNext={() => {
                if (state.idea.trim().length >= 8) setPhase("category");
              }}
            />
          ) : null}

          {phase === "category" ? (
            <CategoryPhase onSelect={goQuestions} onBack={() => setPhase("idea")} />
          ) : null}

          {phase === "questions" && state.categoryId && currentQuestion ? (
            <QuestionsPhase
              key={currentQuestion.id}
              question={currentQuestion}
              value={state.answers[currentQuestion.id]}
              onAnswer={answerCurrent}
              onBack={backFromQuestion}
            />
          ) : null}

          {phase === "questions" &&
          state.categoryId &&
          !currentQuestion &&
          isFlowComplete(state.categoryId, state.answers) ? (
            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                Questions terminées
              </h2>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPhase("extras")}
              >
                Continuer
              </button>
            </div>
          ) : null}

          {phase === "extras" ? (
            <ExtrasPhase
              extras={state.extras}
              onChange={setExtras}
              onBack={() => setPhase("questions")}
              onFinish={() => router.push("/result")}
            />
          ) : null}
        </div>

        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          <Link href="/" className="underline-offset-2 hover:underline">
            Retour à l’accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

function IdeaPhase({
  idea,
  onChange,
  onNext,
}: {
  idea: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const ok = idea.trim().length >= 8;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight">
          Quelle est votre idée ?
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pas besoin d’être précis — on cadrera ensuite avec des questions.
        </p>
      </div>
      <textarea
        className="field-input min-h-36"
        placeholder="Ex. : une landing pour un SaaS B2B qui aide les freelances à facturer…"
        value={idea}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      <div className="flex justify-end">
        <button
          type="button"
          className="btn-primary"
          disabled={!ok}
          onClick={onNext}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

function CategoryPhase({
  onSelect,
  onBack,
}: {
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight">
          Quelle catégorie ?
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ça choisit le parcours de questions le plus court.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="option-btn"
            onClick={() => onSelect(cat.id)}
          >
            <span className="font-medium">{cat.label}</span>
            <span className="mt-0.5 block text-sm text-[var(--muted)]">
              {cat.description}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
}

function QuestionsPhase({
  question,
  value,
  onAnswer,
  onBack,
}: {
  question: Question;
  value: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  onBack: () => void;
}) {
  const initial =
    value ??
    (question.inputType === "multi" ? ([] as string[]) : "");
  const [draft, setDraft] = useState<string | string[]>(initial);

  const canContinue = (() => {
    if (question.inputType === "multi") {
      if (!question.required) return true;
      return Array.isArray(draft) && draft.length > 0;
    }
    if (question.inputType === "text") {
      const t = typeof draft === "string" ? draft.trim() : "";
      return question.required ? t.length > 0 : true;
    }
    return typeof draft === "string" && draft.length > 0;
  })();

  return (
    <div className="space-y-5">
      <QuestionStep question={question} value={draft} onChange={setDraft} />
      <div className="flex justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Retour
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!canContinue}
          onClick={() => {
            if (question.inputType === "multi") {
              onAnswer(Array.isArray(draft) ? draft : []);
            } else if (typeof draft === "string") {
              onAnswer(draft);
            }
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

function ExtrasPhase({
  extras,
  onChange,
  onBack,
  onFinish,
}: {
  extras: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight">
          Une précision libre ?
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Optionnel. Ajoutez ce que les questions n’ont pas couvert.
        </p>
      </div>
      <textarea
        className="field-input min-h-28"
        placeholder="Ex. : public FR uniquement, pas de dépendance payante…"
        value={extras}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Retour
        </button>
        <button type="button" className="btn-primary" onClick={onFinish}>
          Générer le prompt
        </button>
      </div>
    </div>
  );
}
