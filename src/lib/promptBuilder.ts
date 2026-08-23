import { getCategory } from "./categories";
import { getVisibleQuestions, optionLabel } from "./questionFlows";
import type {
  CategoryId,
  ExportFormat,
  Question,
  WizardAnswers,
  WizardState,
} from "./types";

function formatAnswer(question: Question, value: string | string[]): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value
      .map((id) => optionLabel(question, id))
      .join(", ");
  }
  if (question.inputType === "single" || question.inputType === "multi") {
    return optionLabel(question, value);
  }
  return value.trim();
}

function answersBlock(
  categoryId: CategoryId,
  answers: WizardAnswers,
): string {
  const questions = getVisibleQuestions(categoryId, answers);
  return questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => {
      const formatted = formatAnswer(q, answers[q.id]!);
      return `- ${q.label} → ${formatted}`;
    })
    .join("\n");
}

function roleLine(categoryId: CategoryId, answers: WizardAnswers): string {
  if (categoryId === "code") {
    return "Tu es un ingénieur logiciel senior, précis et pragmatique. Tu privilégies les solutions correctes et minimales.";
  }
  if (categoryId === "redaction") {
    const tone = answers.tone;
    const toneHint =
      typeof tone === "string"
        ? ` Ton cible : ${tone}.`
        : "";
    return `Tu es un rédacteur professionnel.${toneHint} Tu écris sans remplissage.`;
  }
  if (categoryId === "analyse") {
    return "Tu es un analyste rigoureux. Tu sépares faits, hypothèses et recommandations. Tu signales l’incertitude.";
  }
  const role = answers.role;
  const map: Record<string, string> = {
    expert: "Tu es un expert du domaine demandé.",
    coach: "Tu es un coach pragmatique qui pousse à l’action.",
    critic: "Tu es un critique constructif : tu pointes les faiblesses et proposes des améliorations.",
    assistant: "Tu es un assistant opérationnel qui livre un résultat utilisable immédiatement.",
    teacher: "Tu es un professeur patient : tu expliques clairement, sans condescendance.",
  };
  if (typeof role === "string" && map[role]) return map[role];
  return "Tu es un assistant utile, clair et concis.";
}

function formatInstructions(
  categoryId: CategoryId,
  answers: WizardAnswers,
): string {
  const lines: string[] = [];
  if (categoryId === "code" && typeof answers.output_format === "string") {
    const map: Record<string, string> = {
      patch: "Livre du code prêt à coller (ou un patch clair).",
      steps: "Explique en étapes courtes, puis donne le code.",
      plan: "Propose d’abord un plan court, puis le code.",
      review: "Fais une revue : risques, alternatives, puis recommandation.",
    };
    lines.push(map[answers.output_format] ?? "");
  }
  if (categoryId === "redaction" && typeof answers.length === "string") {
    const map: Record<string, string> = {
      short: "Longueur : < 150 mots.",
      medium: "Longueur : 150–400 mots.",
      long: "Longueur : 400+ mots.",
      outline: "Livre uniquement un plan / outline.",
    };
    lines.push(map[answers.length] ?? "");
  }
  if (categoryId === "analyse" && typeof answers.output_shape === "string") {
    const map: Record<string, string> = {
      bullets: "Format : puces actionnables.",
      table: "Format : tableau comparatif markdown.",
      memo: "Format : mémo structuré (Contexte / Analyse / Recommandation).",
      score: "Format : score + justification courte.",
    };
    lines.push(map[answers.output_shape] ?? "");
  }
  if (categoryId === "general" && typeof answers.format === "string") {
    const map: Record<string, string> = {
      bullets: "Format : puces.",
      sections: "Format : sections titrées.",
      dialogue: "Format : questions / réponses.",
      checklist: "Format : checklist.",
    };
    lines.push(map[answers.format] ?? "");
  }

  const constraints = answers.constraints;
  if (Array.isArray(constraints) && constraints.length > 0) {
    const q = getVisibleQuestions(categoryId, answers).find(
      (x) => x.id === "constraints",
    );
    if (q) {
      lines.push(`Contraintes : ${formatAnswer(q, constraints)}.`);
    }
  }

  const avoid = answers.avoid;
  if (Array.isArray(avoid) && avoid.length > 0) {
    const q = getVisibleQuestions(categoryId, answers).find(
      (x) => x.id === "avoid",
    );
    if (q) {
      lines.push(`À éviter : ${formatAnswer(q, avoid)}.`);
    }
  }

  return lines.filter(Boolean).join("\n");
}

function platformPreamble(format: ExportFormat): string {
  if (format === "cursor") {
    return [
      "Contexte outil : Cursor (éditeur + agent).",
      "- Propose des changements ciblés, fichiers concernés si possible.",
      "- Ne réécris pas tout le projet sans nécessité.",
      "",
    ].join("\n");
  }
  if (format === "claude") {
    return [
      "Contexte outil : Claude.",
      "- Sois direct. Évite les préambules.",
      "",
    ].join("\n");
  }
  return [
    "Contexte outil : ChatGPT.",
    "- Réponds en une seule passe complète.",
    "",
  ].join("\n");
}

export function buildPrompt(
  state: WizardState,
  format: ExportFormat = "chatgpt",
): string {
  if (!state.categoryId || !state.idea.trim()) {
    return "";
  }

  const category = getCategory(state.categoryId);
  const categoryLabel = category?.label ?? state.categoryId;
  const answered = answersBlock(state.categoryId, state.answers);
  const role = roleLine(state.categoryId, state.answers);
  const formatBlock = formatInstructions(state.categoryId, state.answers);
  const extras = state.extras.trim();

  const parts = [
    platformPreamble(format).trimEnd(),
    "# Rôle",
    role,
    "",
    "# Contexte",
    `Catégorie : ${categoryLabel}`,
    answered,
    extras ? `\nPrécisions libres :\n${extras}` : "",
    "",
    "# Objectif",
    "Produis une réponse qui satisfait l’idée initiale et toutes les réponses ci-dessus, sans poser de questions de clarification sauf blocage absolu.",
    "",
    "# Format de réponse",
    formatBlock || "Réponse claire, structurée, sans remplissage.",
    "",
    "# Idée initiale",
    state.idea.trim(),
  ];

  return parts.filter((p, i, arr) => !(p === "" && arr[i - 1] === "")).join("\n").trim() + "\n";
}

export const STORAGE_KEY = "promptia-wizard-v1";

export function serializeState(state: WizardState): string {
  return JSON.stringify(state);
}

export function parseState(raw: string | null): WizardState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as WizardState;
    if (typeof data.idea !== "string") return null;
    return {
      idea: data.idea,
      categoryId: data.categoryId,
      answers: data.answers ?? {},
      extras: data.extras ?? "",
    };
  } catch {
    return null;
  }
}
