import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "code",
    label: "Code",
    description: "Bug, feature, refactor, architecture",
    accent: "#0d9488",
  },
  {
    id: "redaction",
    label: "Rédaction",
    description: "Email, article, doc, copywriting",
    accent: "#c2410c",
  },
  {
    id: "analyse",
    label: "Analyse",
    description: "Données, décision, synthèse",
    accent: "#0369a1",
  },
  {
    id: "general",
    label: "Général",
    description: "Tout le reste, rôle + contraintes",
    accent: "#4f46e5",
  },
];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
