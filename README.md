# Promptia

Transformez une idée vague en **prompt IA dense** via un wizard de questions ciblées — pour éviter les allers-retours qui brûlent des tokens.

## Lancer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Parcours

1. Saisir une idée brute
2. Choisir une catégorie (code, rédaction, analyse, général)
3. Répondre aux questions branchées
4. Copier le prompt (ChatGPT / Claude / Cursor)

## Ajouter une catégorie

1. Étendre `CategoryId` dans [`src/lib/types.ts`](src/lib/types.ts)
2. Ajouter la catégorie dans [`src/lib/categories.ts`](src/lib/categories.ts)
3. Définir les questions dans [`src/lib/questionFlows.ts`](src/lib/questionFlows.ts)
4. Ajuster le rôle / format dans [`src/lib/promptBuilder.ts`](src/lib/promptBuilder.ts)

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4

Aucune clé API requise en v1 : tout se passe côté navigateur.
