<div align="center">

# ✈️ Preflight

**Ist deine Vibe-Coding-App bereit für den Launch? Finde es mit einem Befehl heraus.**

Preflight scannt dein Projekt nach geleakten Keys, offenen Datenbanken, unverifizierten Zahlungen und fehlenden Launch-Grundlagen und gibt dir dann eine Report Card mit einer Lösung für jeden Fund.

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

Keine Installation, kein Konto, keine Netzwerkanfragen. Dein Code verlässt nie deine Maschine.

## Warum

Mit KI-Tools baust du an einem Wochenende eine App – und genauso leicht schickst du dabei deinen Stripe-Secret-Key im Browser-Bundle mit oder eine Supabase-Tabelle, die jeder lesen kann. Preflight prüft die Fehler, die nach dem Launch am meisten wehtun, bevor du launchst.

## Probiere es zuerst an einer kaputten App

```bash
npx vibe-preflight --demo
```

Scannt eine absichtlich kaputte Demo-App (alle Secrets sind Fake), damit du siehst, wie ein fehlgeschlagener Report aussieht.

## Was es prüft

Heute 17 Checks, über Sicherheit, Zuverlässigkeit und Launch-Grundlagen. Siehe [alle Checks](rules.md).

| | |
|---|---|
| 🔑 Live-Secrets im Client-Code | 🗄️ Supabase-Tabellen ohne Row-Level-Security |
| 📄 `.env`-Dateien, die committet werden können | 💳 Stripe-Webhooks ohne Signaturprüfung |
| 🌍 CORS, offen für jede Website | 🚨 Kein Error-Monitoring |
| 🔒 Keine Datenschutzerklärung | 🔗 Fehlender Titel, fehlende Beschreibung oder fehlendes Share-Image |

## Optionen

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
Setze NO_COLOR=1, um farbige Ausgabe abzuschalten.

Einen Fund, der auf eine Zeile zeigt, blendest du mit `// preflight-ignore <check-id>` in dieser Zeile oder der Zeile darüber aus. Ein Fund, der eine ganze Datei betrifft (eine committete `.env`, ein unverifizierter Webhook), bekommt denselben Kommentar in den ersten fünf Zeilen der Datei. Alles, was du projektweit loswerden willst, auch Funde ohne Datei, nutzt `--ignore <check-id>`.

## In CI verwenden

```yaml
- run: npx vibe-preflight --fail-on critical
```

Der Befehl endet mit Exit-Code 1, sobald ein Fund das `--fail-on`-Level erreicht, also blockiert ein geleakter Key den Merge.

## In Claude Code verwenden

Preflight gibt es als Claude-Code-Plugin mit einem `/preflight`-Befehl, der den Scan ausführt, die Ergebnisse erklärt und anbietet, kritische Probleme eines nach dem anderen zu beheben – und vor jeder Änderung fragt.

Führe in Claude Code aus:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Tippe dann `/preflight` in einem beliebigen Projekt.

## Einen Check in 10 Minuten hinzufügen

Jeder Check ist eine kleine Datei plus zwei Beispielordner, einer, der gefunden werden muss, und einer, der in Ruhe gelassen werden muss. Kein Build-Schritt, keine Abhängigkeiten. Lies [CONTRIBUTING.md](../CONTRIBUTING.md) oder wähle ein Issue mit dem Label [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## Kein Security-Audit

Preflight erwischt häufige Fehler mit großer Wirkung durch schnelle Pattern-Checks. Ein sauberer Report bedeutet, dass keiner seiner Checks angeschlagen hat, nicht dass deine App sicher ist. Nutze es als Sicherheitsgurt, nicht als Ersatz für ein Review.

## FAQ

**Sendet Preflight meinen Code irgendwohin?**

Nein. Preflight läuft vollständig auf deiner lokalen Maschine, macht keine Netzwerkanfragen und sammelt keine Telemetrie. Dein Code verlässt nie deinen Computer.

**Bedeutet ein Score von 100/100, dass meine App sicher ist?**

Nein. Es bedeutet nur, dass keiner von Preflights Checks ein Problem gefunden hat. Siehe den Abschnitt [Kein Security-Audit](#kein-security-audit) für mehr Details.

**Wie blende ich einen False Positive aus?**

Nutze `// preflight-ignore <check-id>` in der betroffenen Zeile oder `--ignore <check-id>` beim Ausführen von Preflight. Bitte öffne außerdem ein GitHub-Issue mit dem Label oder Titel „False positive“, damit der Check verbessert werden kann.

**Welche Stacks versteht es?**

Preflight kann die Dateien jedes Projekts scannen, aber seine Checks funktionieren am besten mit Next.js, Vite, Supabase, Stripe, Express und plainem HTML.

**Warum wird eine verlinkte Datei nicht geprüft?**

Symbolische Links werden absichtlich übersprungen, Dateien wie Ordner. Ihnen zu folgen kann in einer Schleife enden – ein Ordner, der auf sich selbst verlinkt, endet nie – und Dateien außerhalb des Projekts lesen, das du Preflight zum Scannen gegeben hast. Eine `.env`, die ein Symlink auf eine Datei anderswo ist, wird daher nicht gemeldet; kopiere sie herein oder zeige den Check auf den Ordner, der sie wirklich enthält. Der Kommentar zu `walk` in `src/project.js` sagt dasselbe direkt neben dem Code.

## Lizenz

[MIT](../LICENSE). Frei für jede Verwendung.

## Mitwirkende

Danke an alle, die Preflight besser gemacht haben! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
