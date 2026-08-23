import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-5.5rem)] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(105deg,transparent_28%,rgba(42,90,140,0.16)_100%)] sm:w-[62%]" />
          <HeroVisual />
        </div>

        <div className="site-shell relative flex min-h-[calc(100vh-5.5rem)] flex-col justify-center pb-16 pt-4">
          <p className="fade-up brand text-[clamp(3.4rem,12vw,7.5rem)] text-[var(--ink)]">
            Promptia
          </p>

          <h1
            className="fade-up mt-7 max-w-[14ch] hero-title text-[clamp(1.75rem,4.4vw,3.15rem)] text-[var(--ink-soft)]"
            style={{ animationDelay: "90ms" }}
          >
            Un prompt. Zéro allers-retours.
          </h1>

          <p
            className="fade-up mt-5 max-w-md text-base leading-relaxed text-[var(--muted)] sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Une idée brute, quelques questions ciblées, un prompt dense prêt à
            coller dans ChatGPT, Claude ou Cursor.
          </p>

          <div
            className="fade-up mt-9"
            style={{ animationDelay: "230ms" }}
          >
            <Link href="/builder" className="btn-primary">
              Commencer
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-white/40">
        <div className="site-shell py-20 sm:py-24">
          <h2 className="display max-w-xl text-3xl text-[var(--ink)] sm:text-4xl">
            Trois gestes. Un message unique.
          </h2>
          <p className="mt-3 max-w-lg text-[var(--muted)]">
            Clarifier avant de générer — pour ne plus brûler des tokens en
            conversation.
          </p>

          <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                n: "01",
                title: "Idée",
                body: "Écrivez ce que vous voulez — même vague.",
              },
              {
                n: "02",
                title: "Questions",
                body: "Choix courts, branchés sur votre cas.",
              },
              {
                n: "03",
                title: "Prompt",
                body: "Un texte structuré, prêt à coller. Une fois.",
              },
            ].map((item, i) => (
              <li
                key={item.n}
                className="fade-up border-t border-[var(--ink)] pt-5"
                style={{ animationDelay: `${280 + i * 80}ms` }}
              >
                <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.18em] text-[var(--accent)]">
                  {item.n}
                </p>
                <h3 className="display mt-3 text-2xl text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function HeroVisual() {
  const lines = [
    { w: "88%", delay: "0s" },
    { w: "62%", delay: "0.4s" },
    { w: "74%", delay: "0.8s" },
    { w: "51%", delay: "1.2s" },
    { w: "81%", delay: "1.6s" },
    { w: "44%", delay: "2s" },
    { w: "69%", delay: "2.4s" },
    { w: "57%", delay: "2.8s" },
  ];

  return (
    <div className="slide-in absolute inset-y-[12%] right-[-4%] hidden w-[min(48%,520px)] sm:block">
      <div className="hero-prompt-sheet relative h-full border border-[var(--line-strong)] bg-[rgba(255,255,255,0.58)] px-7 py-8 backdrop-blur-[2px]">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--steel)]">
            prompt densifié
          </span>
          <span className="h-2 w-2 rounded-[1px] bg-[var(--accent)]" />
        </div>
        <div className="hero-lines space-y-4">
          {lines.map((line, i) => (
            <span
              key={i}
              style={{ width: line.w, animationDelay: line.delay }}
            />
          ))}
        </div>
        <p className="mt-8 max-w-[18ch] font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--mono-ink)] opacity-70">
          # Rôle · Contexte · Contraintes · Format — un seul bloc, zéro
          clarification.
        </p>
      </div>
    </div>
  );
}
