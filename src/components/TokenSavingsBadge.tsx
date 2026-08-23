"use client";

import type { TokenEstimate } from "@/lib/types";

export function TokenSavingsBadge({ estimate }: { estimate: TokenEstimate }) {
  return (
    <div className="savings-badge">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          Estimation
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          ~{estimate.savedTokens.toLocaleString("fr-FR")} tokens
          <span className="ml-2 text-base text-[var(--accent)]">
            (−{estimate.savedPercent}%)
          </span>
        </p>
      </div>
      <p className="mt-3 max-w-prose text-xs leading-relaxed text-[var(--muted)]">
        Comparaison indicative : conversation type (idée + 6 allers-retours) vs
        ce prompt unique. Pas une mesure exacte d’un fournisseur.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Prompt final</dt>
          <dd className="font-medium tabular-nums">
            ~{estimate.finalPromptTokens}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Conversation naïve</dt>
          <dd className="font-medium tabular-nums">
            ~{estimate.naiveConversationTokens}
          </dd>
        </div>
      </dl>
    </div>
  );
}
