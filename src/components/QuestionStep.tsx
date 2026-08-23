"use client";

import type { Question } from "@/lib/types";

type Props = {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
};

export function QuestionStep({ question, value, onChange }: Props) {
  if (question.inputType === "text") {
    return (
      <div className="space-y-5">
        <QuestionHeader question={question} />
        <textarea
          className="field-input min-h-28"
          placeholder={question.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      </div>
    );
  }

  if (question.inputType === "multi") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-5">
        <QuestionHeader question={question} />
        <div className="grid gap-2">
          {question.options?.map((opt) => {
            const active = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                className={`option-btn ${active ? "option-btn-active" : ""}`}
                onClick={() => {
                  if (active) {
                    onChange(selected.filter((id) => id !== opt.id));
                  } else {
                    onChange([...selected, opt.id]);
                  }
                }}
              >
                <span className="font-semibold">{opt.label}</span>
                {opt.description ? (
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {opt.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <QuestionHeader question={question} />
      <div className="grid gap-2">
        {question.options?.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`option-btn ${active ? "option-btn-active" : ""}`}
              onClick={() => onChange(opt.id)}
            >
              <span className="font-semibold">{opt.label}</span>
              {opt.description ? (
                <span className="mt-1 block text-sm text-[var(--muted)]">
                  {opt.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionHeader({ question }: { question: Question }) {
  return (
    <div>
      <h2 className="display text-2xl leading-tight text-[var(--ink)] sm:text-3xl">
        {question.label}
      </h2>
      {question.help ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {question.help}
        </p>
      ) : null}
    </div>
  );
}
