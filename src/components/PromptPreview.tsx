"use client";

import { useEffect, useState } from "react";
import type { ExportFormat } from "@/lib/types";

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "cursor", label: "Cursor" },
];

type Props = {
  prompt: string;
  format: ExportFormat;
  onFormatChange: (f: ExportFormat) => void;
  onPromptChange: (value: string) => void;
};

export function PromptPreview({
  prompt,
  format,
  onFormatChange,
  onPromptChange,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`format-tab ${format === f.id ? "format-tab-active" : ""}`}
              onClick={() => onFormatChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={copy}>
          {copied ? "Copié" : "Copier le prompt"}
        </button>
      </div>
      <textarea
        className="field-input min-h-[28rem] font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[var(--mono-ink)]"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
