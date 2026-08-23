import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-5.5rem)] overflow-hidden">
        <HeroBackdrop />

        <div className="site-shell relative flex min-h-[calc(100vh-5.5rem)] flex-col justify-center pb-20 pt-6">
          <p className="fade-up brand max-w-[10ch] text-[clamp(3.6rem,13vw,8rem)] text-[var(--ink)]">
            Promptia
          </p>

          <h1
            className="fade-up mt-8 max-w-[16ch] hero-title text-[clamp(1.7rem,4.2vw,3rem)] text-[var(--ink-soft)]"
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

          <div className="fade-up mt-9" style={{ animationDelay: "230ms" }}>
            <Link href="/builder" className="btn-primary">
              Commencer
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-[var(--line)] bg-white/55 backdrop-blur-[1px]">
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

function HeroBackdrop() {
  const strips = [
    { top: "14%", delay: "0s", opacity: 0.55 },
    { top: "26%", delay: "0.35s", opacity: 0.4 },
    { top: "38%", delay: "0.7s", opacity: 0.7 },
    { top: "50%", delay: "1.05s", opacity: 0.35 },
    { top: "62%", delay: "1.4s", opacity: 0.6 },
    { top: "74%", delay: "1.75s", opacity: 0.45 },
    { top: "86%", delay: "2.1s", opacity: 0.3 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="fade-in absolute inset-0 bg-[linear-gradient(115deg,rgba(232,238,244,0.92)_0%,rgba(232,238,244,0.55)_38%,rgba(42,90,140,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_85%_40%,rgba(226,74,28,0.14),transparent_60%)]" />

      <div className="hero-prompt-sheet absolute inset-x-0 inset-y-0">
        {strips.map((s, i) => (
          <div
            key={i}
            className="absolute left-[8%] right-[-5%] h-[7.5%] border-y border-[rgba(42,90,140,0.18)] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35)_18%,rgba(42,90,140,0.12)_55%,rgba(226,74,28,0.1)_78%,transparent)]"
            style={{
              top: s.top,
              opacity: s.opacity,
              animation: `linePulse 4s ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      <p className="slide-in absolute bottom-[18%] right-[6%] hidden max-w-[22ch] text-right font-[family-name:var(--font-mono)] text-[11px] leading-relaxed tracking-wide text-[var(--steel)] sm:block">
        # Rôle · Contexte · Contraintes · Format
        <br />
        un seul bloc — zéro clarification
      </p>
    </div>
  );
}
