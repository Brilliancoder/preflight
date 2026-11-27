<div align="center">

# ✈️ Preflight

**用 vibe coding 做的应用准备好上线了吗？一条命令就能知道。**

Preflight 会扫描你的项目，找出泄露的密钥、开放的数据库、未经验证的支付和缺失的上线基础项，然后为每个问题给出附带修复方案的报告卡。

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

无需安装，无需账号，无需联网。你的代码永远不会离开本机。

## 为什么

AI 工具让一个周末做出一个应用变得容易，也同样容易让你在不知不觉中把 Stripe 密钥放进浏览器 bundle，或者建了一个谁都能读的 Supabase 表。Preflight 会在上线之前，检查那些上线后最让人头疼的错误。

## 先在一个坏掉的应用上试试

```bash
npx vibe-preflight --demo
```

扫描一个故意做坏的演示应用（所有密钥都是假的），看看失败的报告长什么样。

## 检查内容

目前共有 17 项检查，涵盖安全、可靠性和上线基础。查看[所有检查](rules.md)。

| | |
|---|---|
| 🔑 客户端代码中的真实密钥 | 🗄️ 没有行级安全的 Supabase 表 |
| 📄 可能被提交的 `.env` 文件 | 💳 未验证签名的 Stripe Webhook |
| 🌍 对所有网站开放的 CORS | 🚨 没有错误监控 |
| 🔒 没有隐私政策 | 🔗 缺少标题、描述或分享图片 |

## 选项

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
设置 NO_COLOR=1 可以关闭彩色输出。

指向某一行的问题，可以在该行或上一行加上 `// preflight-ignore <check-id>` 来忽略。针对整个文件的问题（已提交的 `.env`、未验证的 Webhook），在文件前五行加上同样的注释。想在整个项目中去掉的内容，包括没有对应文件的问题，使用 `--ignore <check-id>`。

## 在 CI 中使用

```yaml
- run: npx vibe-preflight --fail-on critical
```

当有问题达到 `--fail-on` 级别时，命令会以退出码 1 结束，因此泄露的密钥会阻止合并。

## 在 Claude Code 中使用

Preflight 以 Claude Code 插件的形式提供，附带 `/preflight` 命令：运行扫描、解释结果，并逐个提议修复严重问题，每次修改前都会先征求你的同意。

在 Claude Code 中运行：

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

然后在任意项目中输入 `/preflight`。

## 10 分钟添加一项检查

每项检查只需一个小文件加两个示例文件夹，一个必须被标记，一个必须放过。无需构建步骤，无需依赖。阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)，或从标有 [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22) 的 issue 中选一个。

## 不是安全审计

Preflight 通过快速的模式检查，捕捉常见且影响重大的错误。报告干净只意味着它的检查没有发现问题，并不意味着你的应用是安全的。请把它当作安全带，而不是评审的替代品。

## 常见问题

**Preflight 会把我的代码发到别处吗？**

不会。Preflight 完全在本地机器上运行，不联网，不收集遥测数据。你的代码永远不会离开你的电脑。

**100/100 分意味着我的应用安全吗？**

不是。这只意味着 Preflight 的检查没有发现问题。更多详情请见[不是安全审计](#不是安全审计)一节。

**如何忽略误报？**

在受影响的行上使用 `// preflight-ignore <check-id>`，或在运行 Preflight 时使用 `--ignore <check-id>`。也请开一个标注或标题为 "False positive" 的 GitHub issue，以便改进这项检查。

**支持哪些技术栈？**

Preflight 可以扫描任何项目的文件，但它的检查在 Next.js、Vite、Supabase、Stripe、Express 和纯 HTML 上效果最好。

**为什么不检查符号链接文件？**

符号链接（文件和文件夹）是有意跳过的。跟随它们可能陷入循环——链接到自身的文件夹永远不会结束——还可能读取到你要求 Preflight 扫描的项目之外的文件。因此，指向别处文件的 `.env` 符号链接不会被报告；请把它复制进来，或者让检查指向真正存放它的文件夹。`src/project.js` 中 `walk` 旁边的注释也说了同样的话。

## 许可证

[MIT](../LICENSE)。可用于任何用途，免费。

## 贡献者

感谢所有让 Preflight 变得更好的人！💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
