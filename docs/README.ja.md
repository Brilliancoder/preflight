<div align="center">

# ✈️ Preflight

**バイブコーディングしたアプリはリリース準備ができていますか？1つのコマンドで確認できます。**

Preflightはプロジェクトをスキャンし、漏洩したキー、開かれたデータベース、未検証の決済、不足しているリリースの基本項目を見つけ、問題ごとに修正方法が書かれたレポートカードを提供します。

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

インストール不要、アカウント不要、ネットワーク呼び出しなし。コードがあなたのマシンを離れることはありません。

## なぜ必要なのか

AIツールのおかげで週末にアプリを作るのは簡単になりましたが、同じくらい簡単にStripeのシークレットキーをブラウザバンドルに入れたり、誰でも読めるSupabaseテーブルを作ったりしてしまいます。Preflightはリリース後に最も痛いミスを、リリース前にチェックします。

## まず壊れたアプリで試す

```bash
npx vibe-preflight --demo
```

意図的に壊したデモアプリ（シークレットはすべて偽物です）をスキャンして、失敗したレポートがどう見えるか確認できます。

## チェック内容

現在17件のチェックがあり、セキュリティ、信頼性、リリースの基本をカバーしています。[すべてのチェックを見る](rules.md)。

| | |
|---|---|
| 🔑 クライアントコード内のライブシークレット | 🗄️ 行レベルセキュリティのないSupabaseテーブル |
| 📄 コミットされる可能性のある `.env` ファイル | 💳 署名チェックのないStripeウェブフック |
| 🌍 すべてのウェブサイトに開かれたCORS | 🚨 エラーモニタリングなし |
| 🔒 プライバシーポリシーなし | 🔗 タイトル、説明、シェア画像の欠落 |

## オプション

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
NO_COLOR=1を設定するとカラー出力を無効にできます。

行を指す問題は、その行または直上の行に `// preflight-ignore <check-id>` と書くことで無視できます。ファイル全体に関する問題（コミットされた `.env`、未検証のウェブフック）は、ファイルの最初の5行に同じコメントを書きます。プロジェクト全体で消したいもの（ファイルのない問題を含む）は `--ignore <check-id>` を使います。

## CIで使う

```yaml
- run: npx vibe-preflight --fail-on critical
```

問題が `--fail-on` のレベルに達するとコマンドは終了コード1で終了するため、漏洩したキーはマージをブロックします。

## Claude Code内で使う

Preflightは `/preflight` コマンド付きのClaude Codeプラグインとして提供され、スキャンを実行し、結果を説明し、重要な問題を1つずつ修正することを提案し、変更のたびに必ず確認します。

Claude Codeで実行:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

その後、任意のプロジェクトで `/preflight` と入力します。

## 10分でチェックを追加する

各チェックは小さなファイル1つとサンプルフォルダ2つ（1つは必ず検出され、もう1つは見逃されなければなりません）だけです。ビルドステップも依存関係も不要です。[CONTRIBUTING.md](../CONTRIBUTING.md)を読むか、[`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22)ラベルの付いたissueから1つ選んでください。

## セキュリティ監査ではありません

Preflightは高速なパターンチェックで、一般的で影響の大きいミスを捉えます。クリーンなレポートは、チェックが問題を検出しなかったという意味であり、アプリが安全だという意味ではありません。レビューの代わりではなく、シートベルトとして使ってください。

## FAQ

**Preflightはコードをどこかに送信しますか？**

いいえ。Preflightはローカルマシン上でのみ動作し、ネットワーク呼び出しを行わず、テレメトリも収集しません。コードがコンピュータを離れることはありません。

**100/100のスコアはアプリが安全だという意味ですか？**

いいえ。Preflightのチェックが問題を検出しなかったという意味にすぎません。詳しくは[セキュリティ監査ではありません](#セキュリティ監査ではありません)セクションをご覧ください。

**誤検出を無視するにはどうすればよいですか？**

影響を受ける行に `// preflight-ignore <check-id>` を書くか、Preflightの実行時に `--ignore <check-id>` を使います。チェックを改善できるよう、「False positive」というラベルまたはタイトルでGitHub issueも開いてください。

**どのスタックに対応していますか？**

Preflightはあらゆるプロジェクトのファイルをスキャンできますが、チェックはNext.js、Vite、Supabase、Stripe、Express、素のHTMLで最もよく機能します。

**シンボリックリンクのファイルがチェックされないのはなぜですか？**

シンボリックリンクはファイルもフォルダも意図的にスキップされます。たどると無限ループになる可能性があり（自分自身にリンクしたフォルダは終わりません）、Preflightにスキャンを依頼したプロジェクト外のファイルを読む可能性もあります。そのため、別の場所のファイルを指す `.env` のシンボリックリンクは報告されません。プロジェクト内にコピーするか、実際にそのファイルを保持しているフォルダを指してください。`src/project.js` の `walk` に対するコメントにも、コードの横に同じことが書かれています。

## ライセンス

[MIT](../LICENSE)。あらゆる用途に無料です。

## コントリビューター

Preflightをより良くしてくださった皆さん、ありがとうございます！💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
