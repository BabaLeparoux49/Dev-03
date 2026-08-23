# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is

This repository (`Dev-03`) contains no conventional application code. Its only
functional component is the **graphify** knowledge-graph tool, installed as a
Cursor skill under `.agents/skills/graphify/` with an always-apply rule at
`.cursor/rules/graphify.mdc`. There is no web server, database, or test suite to run.
The `oui` file is just a scratch list of git bootstrap commands, not runnable app code.

### The one dependency: graphify

`graphify` is the Python package `graphifyy` (pinned to the skill version in
`.agents/skills/graphify/.graphify_version`). The startup update script installs it
system-wide so the `graphify` CLI is on `PATH` at `/usr/local/bin/graphify`. No API
key is required for the core flow — code is extracted structurally (AST, free);
semantic extraction of docs only uses Gemini if `GEMINI_API_KEY`/`GOOGLE_API_KEY` is
set, otherwise the host agent acts as the LLM. Never block on or prompt for an API key.

### Running / "the application"

The product's core flow is: build a knowledge graph, then query it. Follow the skill
at `.agents/skills/graphify/SKILL.md` for the full pipeline. Quick reference once a
graph exists at `graphify-out/graph.json`:

- `graphify query "<question>"` — BFS/DFS traversal for context
- `graphify path "<A>" "<B>"` — shortest path between two nodes
- `graphify explain "<node>"` — explain a node and its neighbors
- `graphify export html` — regenerate `graphify-out/graph.html`

Non-obvious caveats:

- This repo's own corpus is **all markdown docs** (0 code files: `oui` has no
  extension so AST extraction is empty). A full doc graph therefore needs semantic
  extraction, which the host agent performs when no Gemini key is set — there is no
  fully-automatic zero-LLM build for this repo's own content.
- `graphify-out/` is generated output, not source. Treat it as disposable/local; do
  not assume a committed graph exists.
- Per `.cursor/rules/graphify.mdc`, prefer `graphify query/path/explain` over raw
  Read/Grep/Glob when exploring, and run `graphify update .` after editing code files.

### Lint / test / build

There is no lint config, no automated test suite, and no build step in this repo.
"Building" means running the graphify pipeline to produce `graphify-out/graph.json`,
`GRAPH_REPORT.md`, and `graph.html`.
