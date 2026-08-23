"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PromptPreview } from "@/components/PromptPreview";
import { TokenSavingsBadge } from "@/components/TokenSavingsBadge";
import { useWizard } from "@/components/WizardProvider";
import { buildPrompt } from "@/lib/promptBuilder";
import { estimateSavings } from "@/lib/tokenEstimate";
import type { ExportFormat } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const { state, reset, hydrated } = useWizard();
  const [format, setFormat] = useState<ExportFormat>("chatgpt");
  const [edited, setEdited] = useState<string | null>(null);
  const [editBaseKey, setEditBaseKey] = useState(`${format}|base`);

  const generated = useMemo(
    () => buildPrompt(state, format),
    [state, format],
  );

  const baseKey = `${format}|${state.idea}|${state.categoryId}|${JSON.stringify(state.answers)}|${state.extras}`;
  if (editBaseKey !== baseKey && edited !== null) {
    setEditBaseKey(baseKey);
    setEdited(null);
  } else if (editBaseKey !== baseKey) {
    setEditBaseKey(baseKey);
  }

  const prompt = edited ?? generated;
  const estimate = useMemo(() => estimateSavings(prompt), [prompt]);

  if (!hydrated) {
    return (
      <div className="site-shell flex flex-1 items-center justify-center py-20 text-[var(--muted)]">
        Chargement…
      </div>
    );
  }

  if (!state.idea.trim() || !state.categoryId) {
    return (
      <div className="site-shell flex flex-1 flex-col items-start justify-center gap-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Aucun prompt en cours
        </h1>
        <p className="text-[var(--muted)]">
          Reprenez le wizard pour construire un prompt.
        </p>
        <Link href="/builder" className="btn-primary">
          Commencer
        </Link>
      </div>
    );
  }

  return (
    <div className="site-shell flex flex-1 flex-col gap-6 py-8 sm:py-12">
      <div className="fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Résultat
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            Votre prompt est prêt
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/builder" className="btn-ghost">
            Modifier
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              reset();
              router.push("/builder");
            }}
          >
            Nouveau
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="panel fade-up" style={{ animationDelay: "60ms" }}>
          <PromptPreview
            prompt={prompt}
            format={format}
            onFormatChange={(f) => {
              setFormat(f);
              setEdited(null);
            }}
            onPromptChange={setEdited}
          />
        </div>
        <aside
          className="fade-up space-y-4"
          style={{ animationDelay: "120ms" }}
        >
          <TokenSavingsBadge estimate={estimate} />
          <div className="panel text-sm leading-relaxed text-[var(--muted)]">
            Collez ce prompt en un seul message dans votre outil IA. Vous
            évitez les tours de clarification qui renvoient tout l’historique.
          </div>
        </aside>
      </div>
    </div>
  );
}
