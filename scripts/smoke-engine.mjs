import { createRequire } from "module";
// Quick compiled-style test by dynamic import via tsx if available
const { spawnSync } = await import("child_process");
const r = spawnSync(
  "npx",
  [
    "--yes",
    "tsx",
    "-e",
    `
import { getNextQuestion, isFlowComplete } from "./src/lib/questionFlows.ts";
import { buildPrompt } from "./src/lib/promptBuilder.ts";
import { estimateSavings } from "./src/lib/tokenEstimate.ts";

let answers: Record<string, string | string[]> = {};
const cat = "code" as const;
const steps: string[] = [];
while (true) {
  const q = getNextQuestion(cat, answers);
  if (!q) break;
  let value: string | string[];
  if (q.inputType === "single") value = q.options![0].id;
  else if (q.inputType === "multi") value = (q.options ?? []).slice(0, 2).map((o) => o.id);
  else value = "Comportement incorrect sur submit, attendu 200 OK";
  answers = { ...answers, [q.id]: value };
  steps.push(q.id);
}
console.log("STEPS", steps.length, steps.join(","));
console.log("COMPLETE", isFlowComplete(cat, answers));
const prompt = buildPrompt(
  { idea: "une app factures freelance", categoryId: cat, answers, extras: "Next.js" },
  "cursor",
);
console.log("PROMPT_LEN", prompt.length);
console.log("HAS_ROLE", prompt.includes("# Rôle"));
console.log("HAS_IDEA", prompt.includes("factures freelance"));
console.log("SAVINGS", JSON.stringify(estimateSavings(prompt)));
`,
  ],
  { cwd: "/workspace", encoding: "utf8", timeout: 60000 },
);
console.log(r.stdout);
console.error(r.stderr);
process.exit(r.status ?? 1);
