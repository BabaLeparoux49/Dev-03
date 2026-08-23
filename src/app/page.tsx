import Link from "next/link";

export default function HomePage() {
  return (
    <section className="site-shell relative flex flex-1 flex-col justify-center pb-16 pt-6 sm:pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 -z-10 mx-auto h-[420px] w-[min(920px,100%)] rounded-[40%] bg-[radial-gradient(circle_at_center,var(--glow),transparent_70%)] blur-2xl"
      />

      <p className="fade-up brand text-5xl text-[var(--ink)] sm:text-7xl md:text-8xl">
        Promptia
      </p>

      <h1
        className="fade-up mt-6 max-w-3xl hero-title text-3xl text-[var(--ink)] sm:text-5xl"
        style={{ animationDelay: "80ms" }}
      >
        Un prompt. Zéro allers-retours.
      </h1>

      <p
        className="fade-up mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
        style={{ animationDelay: "140ms" }}
      >
        Partez d’une idée brute. Répondez à quelques questions ciblées. Obtenez
        un prompt dense à coller dans ChatGPT, Claude ou Cursor — sans brûler
        des tokens en clarification.
      </p>

      <div
        className="fade-up mt-8 flex flex-wrap gap-3"
        style={{ animationDelay: "200ms" }}
      >
        <Link href="/builder" className="btn-primary">
          Commencer
        </Link>
        <a href="#comment" className="btn-ghost">
          Comment ça marche
        </a>
      </div>

      <div
        id="comment"
        className="fade-up mt-16 grid gap-4 sm:grid-cols-3"
        style={{ animationDelay: "260ms" }}
      >
        {[
          {
            title: "1. Idée",
            body: "Écrivez ce que vous voulez — même vague.",
          },
          {
            title: "2. Questions",
            body: "Choix multiples courts, branchés sur votre cas.",
          },
          {
            title: "3. Prompt",
            body: "Un texte structuré, prêt à coller. Une seule fois.",
          },
        ].map((item) => (
          <article key={item.title} className="panel">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
