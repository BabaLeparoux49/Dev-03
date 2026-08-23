import type { TokenEstimate } from "./types";

/** Heuristique simple : ~4 caractères ≈ 1 token (FR/EN mixte). */
export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

/**
 * Simule une conversation naïve : idée + 6 tours (user court + réponse IA moyenne).
 * Indicatif uniquement — pas une mesure exacte d'un fournisseur.
 */
export function estimateSavings(finalPrompt: string): TokenEstimate {
  const finalPromptTokens = estimateTokens(finalPrompt);
  const naiveUserTurns = 6 * 40;
  const naiveAssistantTurns = 6 * 150;
  const ideaTokens = estimateTokens(
    finalPrompt.split("## Idée initiale")[1]?.slice(0, 500) ?? "",
  );
  const naiveConversationTokens =
    Math.max(ideaTokens, 30) + naiveUserTurns + naiveAssistantTurns;
  const savedTokens = Math.max(0, naiveConversationTokens - finalPromptTokens);
  const savedPercent =
    naiveConversationTokens === 0
      ? 0
      : Math.round((savedTokens / naiveConversationTokens) * 100);

  return {
    finalPromptTokens,
    naiveConversationTokens,
    savedTokens,
    savedPercent,
  };
}
