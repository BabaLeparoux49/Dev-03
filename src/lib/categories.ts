import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "code",
    label: "Code",
    description: "Bug, feature, refactor, architecture",
    accent: "#2a5a8c",
  },
  {
    id: "redaction",
    label: "Rédaction",
    description: "Email, article, doc, copywriting",
    accent: "#e24a1c",
  },
  {
    id: "analyse",
    label: "Analyse",
    description: "Données, décision, synthèse",
    accent: "#1c4d6e",
  },
  {
    id: "general",
    label: "Général",
    description: "Tout le reste, rôle + contraintes",
    accent: "#0a1628",
  },
];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
