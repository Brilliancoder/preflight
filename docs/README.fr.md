<div align="center">

# ✈️ Preflight

**Ton app codée avec l'IA est-elle prête à être lancée ? Découvre-le en une commande.**

Preflight scanne ton projet pour y trouver les clés fuitées, les bases de données ouvertes, les paiements non vérifiés et les bases du lancement manquantes, puis te donne une fiche de résultats avec un correctif pour chaque problème.

[![License: MIT](https://img.shields.io/badge/license-MIT-34d399.svg)](../LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-38bdf8.svg)](../package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-fbbf24.svg)](../CONTRIBUTING.md)
[![npm version](https://img.shields.io/npm/v/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![npm downloads](https://img.shields.io/npm/dm/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![CI](https://github.com/erdellll/preflight/actions/workflows/ci.yml/badge.svg)](https://github.com/erdellll/preflight/actions/workflows/ci.yml)

![Preflight report card](assets/report-card.png)

</div>

```bash
npx vibe-preflight
```

Pas d'installation, pas de compte, pas d'appels réseau. Ton code ne quitte jamais ta machine.

## Pourquoi

Les outils d'IA facilitent la création d'une app en un week-end, et tout aussi facilement l'envoi de ta clé secrète Stripe dans le bundle du navigateur ou d'une table Supabase que tout le monde peut lire. Preflight vérifie les erreurs qui font le plus mal après le lancement, avant le lancement.

## Essaie-le d'abord sur une app cassée

```bash
npx vibe-preflight --demo
```

Scanne une app de démo volontairement cassée (tous les secrets sont faux) pour voir à quoi ressemble un rapport en échec.

## Ce qu'il vérifie

17 vérifications aujourd'hui, couvrant la sécurité, la fiabilité et les bases du lancement. Voir [toutes les vérifications](rules.md).

| | |
|---|---|
| 🔑 Secrets en production dans le code client | 🗄️ Tables Supabase sans sécurité au niveau des lignes |
| 📄 Fichiers `.env` qui peuvent être commités | 💳 Webhooks Stripe sans vérification de signature |
| 🌍 CORS ouvert à tous les sites web | 🚨 Pas de surveillance des erreurs |
| 🔒 Pas de politique de confidentialité | 🔗 Titre, description ou image de partage manquants |

## Options

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
Définis NO_COLOR=1 pour désactiver la sortie colorée.

Fais taire un résultat qui pointe vers une ligne avec `// preflight-ignore <check-id>` sur cette ligne ou celle du dessus. Un résultat qui concerne un fichier entier (un `.env` commité, un webhook non vérifié) prend le même commentaire dans les cinq premières lignes du fichier. Tout ce que tu veux faire disparaître dans tout le projet, y compris les résultats sans fichier, utilise `--ignore <check-id>`.

## L'utiliser dans la CI

```yaml
- run: npx vibe-preflight --fail-on critical
```

La commande se termine avec le code 1 quand un résultat atteint le niveau `--fail-on`, donc une clé fuitée bloque le merge.

## L'utiliser dans Claude Code

Preflight est livré comme un plugin Claude Code avec une commande `/preflight` qui lance le scan, explique les résultats et propose de corriger les problèmes critiques un par un, en demandant avant chaque changement.

Dans Claude Code, exécute :

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Tape ensuite `/preflight` dans n'importe quel projet.

## Ajouter une vérification en 10 minutes

Chaque vérification est un petit fichier plus deux dossiers d'exemple, un qu'elle doit signaler et un qu'elle doit laisser tranquille. Pas d'étape de build, pas de dépendances. Lis [CONTRIBUTING.md](../CONTRIBUTING.md), ou choisis une issue étiquetée [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## Pas un audit de sécurité

Preflight attrape les erreurs courantes et à fort impact avec des vérifications rapides par motifs. Un rapport propre signifie qu'aucune de ses vérifications ne s'est déclenchée, pas que ton app est sécurisée. Utilise-le comme une ceinture de sécurité, pas comme un substitut à une revue.

## FAQ

**Est-ce que Preflight envoie mon code quelque part ?**

Non. Preflight tourne entièrement sur ta machine locale, ne fait aucun appel réseau et ne collecte aucune télémétrie. Ton code ne quitte jamais ton ordinateur.

**Un score de 100/100 signifie-t-il que mon app est sécurisée ?**

Non. Cela signifie seulement qu'aucune vérification de Preflight n'a détecté de problème. Voir la section [Pas un audit de sécurité](#pas-un-audit-de-sécurité) pour plus de détails.

**Comment faire taire un faux positif ?**

Utilise `// preflight-ignore <check-id>` sur la ligne concernée ou `--ignore <check-id>` en lançant Preflight. Ouvre aussi une issue GitHub étiquetée ou intitulée « False positive » pour que la vérification puisse être améliorée.

**Quels stacks comprend-il ?**

Preflight peut scanner les fichiers de n'importe quel projet, mais ses vérifications fonctionnent le mieux avec Next.js, Vite, Supabase, Stripe, Express et du HTML simple.

**Pourquoi un fichier lié par un lien symbolique n'est-il pas vérifié ?**

Les liens symboliques sont ignorés exprès, fichiers comme dossiers. Les suivre peut boucler — un dossier lié à lui-même ne se termine jamais — et peut lire des fichiers en dehors du projet que tu as demandé à Preflight de scanner. Un `.env` qui est un lien symbolique vers un fichier ailleurs n'est donc pas signalé ; copie-le dans le projet, ou pointe la vérification vers le dossier qui le contient vraiment. Le commentaire sur `walk` dans `src/project.js` dit la même chose à côté du code.

## Licence

[MIT](../LICENSE). Gratuit pour tout usage.

## Contributeurs

Merci à toutes les personnes qui ont rendu Preflight meilleur ! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
