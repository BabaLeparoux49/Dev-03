"use client";

type Props = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressBar({ current, total, label }: Props) {
  const pct = Math.min(100, Math.round((current / Math.max(total, 1)) * 100));
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
        <span>{label ?? "Progression"}</span>
        <span className="tabular-nums text-[var(--ink)]">
          {current}/{total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
