"use client";

import type { TokenEstimate } from "@/lib/types";

export function TokenSavingsBadge({ estimate }: { estimate: TokenEstimate }) {
  return (
    <div className="savings-panel">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Estimation
      </p>
      <p className="display mt-2 text-3xl leading-none text-[var(--ink)]">
        ~{estimate.savedTokens.toLocaleString("fr-FR")}
        <span className="ml-2 text-lg text-[var(--accent)]">
          (−{estimate.savedPercent}%)
        </span>
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">tokens économisés</p>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Comparaison indicative : conversation type (idée + 6 allers-retours) vs
        ce prompt unique.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-4 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Prompt final</dt>
          <dd className="mt-1 font-semibold tabular-nums">
            ~{estimate.finalPromptTokens}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Conversation naïve</dt>
          <dd className="mt-1 font-semibold tabular-nums">
            ~{estimate.naiveConversationTokens}
          </dd>
        </div>
      </dl>
    </div>
  );
}
