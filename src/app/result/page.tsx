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

  const generated = useMemo(
    () => buildPrompt(state, format),
    [state, format],
  );

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
      <div className="site-shell flex flex-1 flex-col items-start justify-center gap-5 py-16">
        <h1 className="display text-3xl sm:text-4xl">Aucun prompt en cours</h1>
        <p className="max-w-md text-[var(--muted)]">
          Reprenez le wizard pour construire un prompt.
        </p>
        <Link href="/builder" className="btn-primary">
          Commencer
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="site-shell flex flex-1 flex-col gap-10 py-10 sm:py-14">
      <div className="fade-up flex flex-wrap items-end justify-between gap-5 border-b border-[var(--line)] pb-8">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
            Résultat
          </p>
          <h1 className="display mt-2 text-3xl sm:text-5xl">
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

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="fade-up" style={{ animationDelay: "70ms" }}>
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
          className="fade-up space-y-8 lg:border-l lg:border-[var(--line)] lg:pl-8"
          style={{ animationDelay: "140ms" }}
        >
          <TokenSavingsBadge estimate={estimate} />
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Collez ce prompt en un seul message dans votre outil IA. Vous évitez
            les tours de clarification qui renvoient tout l’historique.
          </p>
        </aside>
      </div>
    </div>
  );
}
