import type { CategoryId, Question, WizardAnswers } from "./types";

const CODE_QUESTIONS: Question[] = [
  {
    id: "code_type",
    label: "Quel type de tâche ?",
    inputType: "single",
    required: true,
    options: [
      { id: "bug", label: "Corriger un bug", description: "Comportement incorrect" },
      { id: "feature", label: "Ajouter une feature", description: "Nouveau comportement" },
      { id: "refactor", label: "Refactoriser", description: "Sans changer le comportement" },
      { id: "architecture", label: "Architecture / design", description: "Décision structurelle" },
      { id: "explain", label: "Expliquer du code", description: "Comprendre / documenter" },
    ],
  },
  {
    id: "language",
    label: "Langage / stack principal ?",
    inputType: "single",
    required: true,
    options: [
      { id: "ts", label: "TypeScript / JavaScript" },
      { id: "python", label: "Python" },
      { id: "go", label: "Go" },
      { id: "rust", label: "Rust" },
      { id: "java", label: "Java / Kotlin" },
      { id: "other", label: "Autre / polyglotte" },
    ],
  },
  {
    id: "framework",
    label: "Cadre ou environnement ?",
    help: "Optionnel mais utile pour cadrer la réponse.",
    inputType: "single",
    options: [
      { id: "next", label: "Next.js / React" },
      { id: "node", label: "Node / API" },
      { id: "django", label: "Django / FastAPI" },
      { id: "mobile", label: "Mobile" },
      { id: "none", label: "Aucun / pas pertinent" },
    ],
  },
  {
    id: "bug_symptom",
    label: "Que se passe-t-il exactement ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : le formulaire renvoie 500 après submit, stacktrace…",
    when: { code_type: "bug" },
  },
  {
    id: "bug_expected",
    label: "Comportement attendu ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : validation puis redirection vers /dashboard",
    when: { code_type: "bug" },
  },
  {
    id: "feature_goal",
    label: "Quel résultat utilisateur doit exister à la fin ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : l’utilisateur peut exporter son rapport en PDF",
    when: { code_type: "feature" },
  },
  {
    id: "acceptance",
    label: "Critères d’acceptation (liste courte) ?",
    inputType: "text",
    placeholder: "Ex. : bouton visible, PDF < 2 Mo, erreurs affichées",
    when: { code_type: ["feature", "refactor"] },
  },
  {
    id: "constraints",
    label: "Contraintes à respecter ?",
    inputType: "multi",
    options: [
      { id: "tests", label: "Inclure / mettre à jour des tests" },
      { id: "no_deps", label: "Pas de nouvelle dépendance" },
      { id: "perf", label: "Performance critique" },
      { id: "a11y", label: "Accessibilité" },
      { id: "security", label: "Sécurité / secrets" },
      { id: "minimal", label: "Diff minimal" },
    ],
  },
  {
    id: "output_format",
    label: "Format de réponse souhaité ?",
    inputType: "single",
    required: true,
    options: [
      { id: "patch", label: "Code prêt à coller / patch" },
      { id: "steps", label: "Étapes + code" },
      { id: "plan", label: "Plan d’abord, code ensuite" },
      { id: "review", label: "Revue + risques" },
    ],
  },
];

const REDACTION_QUESTIONS: Question[] = [
  {
    id: "doc_type",
    label: "Quel type de texte ?",
    inputType: "single",
    required: true,
    options: [
      { id: "email", label: "Email / message" },
      { id: "article", label: "Article / blog" },
      { id: "landing", label: "Page / landing" },
      { id: "doc", label: "Documentation technique" },
      { id: "social", label: "Post réseaux" },
      { id: "other", label: "Autre" },
    ],
  },
  {
    id: "audience",
    label: "À qui s’adresse-t-il ?",
    inputType: "single",
    required: true,
    options: [
      { id: "devs", label: "Développeurs" },
      { id: "business", label: "Business / décideurs" },
      { id: "grand_public", label: "Grand public" },
      { id: "interne", label: "Équipe interne" },
      { id: "clients", label: "Clients / prospects" },
    ],
  },
  {
    id: "tone",
    label: "Quel ton ?",
    inputType: "single",
    required: true,
    options: [
      { id: "pro", label: "Professionnel" },
      { id: "direct", label: "Direct et clair" },
      { id: "friendly", label: "Chaleureux" },
      { id: "expert", label: "Expert / technique" },
      { id: "persuasive", label: "Persuasif" },
    ],
  },
  {
    id: "length",
    label: "Longueur cible ?",
    inputType: "single",
    required: true,
    options: [
      { id: "short", label: "Court (< 150 mots)" },
      { id: "medium", label: "Moyen (150–400 mots)" },
      { id: "long", label: "Long (400+ mots)" },
      { id: "outline", label: "Plan / outline seulement" },
    ],
  },
  {
    id: "goal",
    label: "Objectif principal ?",
    inputType: "single",
    required: true,
    options: [
      { id: "inform", label: "Informer" },
      { id: "convince", label: "Convaincre / CTA" },
      { id: "explain", label: "Expliquer un sujet complexe" },
      { id: "onboard", label: "Onboarder / guider" },
      { id: "seo", label: "SEO / ranking" },
    ],
  },
  {
    id: "must_include",
    label: "Éléments obligatoires à inclure ?",
    inputType: "text",
    placeholder: "Ex. : mentionner le prix, CTA vers /pricing, ton FR",
  },
  {
    id: "avoid",
    label: "À éviter ?",
    inputType: "multi",
    options: [
      { id: "jargon", label: "Jargon inutile" },
      { id: "emoji", label: "Emojis" },
      { id: "hype", label: "Survente / hype" },
      { id: "passive", label: "Voix passive" },
      { id: "ai_tone", label: "Ton « IA générique »" },
    ],
  },
];

const ANALYSE_QUESTIONS: Question[] = [
  {
    id: "analyse_type",
    label: "Quel type d’analyse ?",
    inputType: "single",
    required: true,
    options: [
      { id: "data", label: "Données / métriques" },
      { id: "decision", label: "Aide à la décision" },
      { id: "compare", label: "Comparaison d’options" },
      { id: "synth", label: "Synthèse de documents" },
      { id: "risk", label: "Risques / trade-offs" },
    ],
  },
  {
    id: "input_form",
    label: "Sous quelle forme est l’entrée ?",
    inputType: "single",
    required: true,
    options: [
      { id: "text", label: "Texte collé dans le chat" },
      { id: "table", label: "Tableau / CSV" },
      { id: "code", label: "Logs / code" },
      { id: "url", label: "Lien / page" },
      { id: "none", label: "Je décris seulement le contexte" },
    ],
  },
  {
    id: "decision",
    label: "Quelle décision doit sortir à la fin ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : choisir entre A et B, prioriser 3 actions",
  },
  {
    id: "depth",
    label: "Niveau de profondeur ?",
    inputType: "single",
    required: true,
    options: [
      { id: "executive", label: "Exécutif (1 page max)" },
      { id: "balanced", label: "Équilibré" },
      { id: "deep", label: "Approfondi" },
    ],
  },
  {
    id: "output_shape",
    label: "Forme de la réponse ?",
    inputType: "single",
    required: true,
    options: [
      { id: "bullets", label: "Puces actionnables" },
      { id: "table", label: "Tableau comparatif" },
      { id: "memo", label: "Mémo structuré" },
      { id: "score", label: "Score + justification" },
    ],
  },
  {
    id: "assumptions",
    label: "Hypothèses ou contraintes connues ?",
    inputType: "text",
    placeholder: "Ex. : budget < 5k€, délai 2 semaines, audience B2B",
  },
];

const GENERAL_QUESTIONS: Question[] = [
  {
    id: "role",
    label: "Quel rôle doit jouer l’IA ?",
    inputType: "single",
    required: true,
    options: [
      { id: "expert", label: "Expert du domaine" },
      { id: "coach", label: "Coach / mentor" },
      { id: "critic", label: "Critique constructif" },
      { id: "assistant", label: "Assistant opérationnel" },
      { id: "teacher", label: "Professeur patient" },
    ],
  },
  {
    id: "domain",
    label: "Domaine principal ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : product management, cuisine, fiscalité…",
  },
  {
    id: "success",
    label: "À quoi ressemble le succès ?",
    inputType: "text",
    required: true,
    placeholder: "Ex. : une checklist claire que je peux appliquer demain",
  },
  {
    id: "constraints",
    label: "Contraintes ?",
    inputType: "multi",
    options: [
      { id: "short", label: "Réponse courte" },
      { id: "fr", label: "Répondre en français" },
      { id: "sources", label: "Citer des sources / incertitudes" },
      { id: "steps", label: "Étapes numérotées" },
      { id: "no_fluff", label: "Zéro remplissage" },
    ],
  },
  {
    id: "format",
    label: "Format préféré ?",
    inputType: "single",
    required: true,
    options: [
      { id: "bullets", label: "Puces" },
      { id: "sections", label: "Sections titrées" },
      { id: "dialogue", label: "Q/R" },
      { id: "checklist", label: "Checklist" },
    ],
  },
];

const FLOWS: Record<CategoryId, Question[]> = {
  code: CODE_QUESTIONS,
  redaction: REDACTION_QUESTIONS,
  analyse: ANALYSE_QUESTIONS,
  general: GENERAL_QUESTIONS,
};

function matchesWhen(
  when: Question["when"],
  answers: WizardAnswers,
): boolean {
  if (!when) return true;
  return Object.entries(when).every(([key, expected]) => {
    const value = answers[key];
    if (value === undefined) return false;
    if (Array.isArray(expected)) {
      if (Array.isArray(value)) {
        return value.some((v) => expected.includes(v));
      }
      return expected.includes(String(value));
    }
    if (Array.isArray(value)) return value.includes(expected);
    return value === expected;
  });
}

export function getVisibleQuestions(
  categoryId: CategoryId,
  answers: WizardAnswers,
): Question[] {
  return FLOWS[categoryId].filter((q) => matchesWhen(q.when, answers));
}

export function getNextQuestion(
  categoryId: CategoryId,
  answers: WizardAnswers,
): Question | null {
  const visible = getVisibleQuestions(categoryId, answers);
  return visible.find((q) => answers[q.id] === undefined) ?? null;
}

export function isFlowComplete(
  categoryId: CategoryId,
  answers: WizardAnswers,
): boolean {
  const visible = getVisibleQuestions(categoryId, answers);
  return visible.every((q) => {
    if (!q.required) return true;
    const v = answers[q.id];
    if (v === undefined) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim().length > 0;
  });
}

export function getProgress(
  categoryId: CategoryId,
  answers: WizardAnswers,
): { current: number; total: number } {
  const visible = getVisibleQuestions(categoryId, answers);
  const answered = visible.filter((q) => answers[q.id] !== undefined).length;
  return { current: answered, total: Math.max(visible.length, 1) };
}

export function optionLabel(
  question: Question,
  optionId: string,
): string {
  return question.options?.find((o) => o.id === optionId)?.label ?? optionId;
}
