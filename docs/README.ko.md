<div align="center">

# ✈️ Preflight

**바이브 코딩한 앱, 출시 준비가 되었나요? 한 번의 명령으로 확인하세요.**

Preflight는 프로젝트를 스캔하여 유출된 키, 열려 있는 데이터베이스, 검증되지 않은 결제, 누락된 출시 기본 요소를 찾은 뒤, 각 문제에 대한 해결책이 담긴 리포트 카드를 제공합니다.

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

설치도, 계정도, 네트워크 호출도 없습니다. 코드는 절대 내 컴퓨터를 떠나지 않습니다.

## 왜 필요한가요

AI 도구를 사용하면 주말에 앱을 만드는 것이 쉬워졌고, 그만큼 Stripe 시크릿 키를 브라우저 번들에 넣거나 누구나 읽을 수 있는 Supabase 테이블을 만드는 실수도 쉬워졌습니다. Preflight는 출시 후에 가장 큰 피해를 주는 실수를 출시 전에 검사합니다.

## 먼저 망가진 앱으로 시험해 보기

```bash
npx vibe-preflight --demo
```

일부러 망가뜨린 데모 앱(모든 시크릿은 가짜입니다)을 스캔하여 실패한 리포트가 어떻게 보이는지 확인할 수 있습니다.

## 검사 항목

현재 17개의 검사가 있으며, 보안, 안정성, 출시 기본 요소를 다룹니다. [모든 검사 보기](rules.md).

| | |
|---|---|
| 🔑 클라이언트 코드에 있는 라이브 시크릿 | 🗄️ 행 수준 보안이 없는 Supabase 테이블 |
| 📄 커밋될 수 있는 `.env` 파일 | 💳 서명 검사가 없는 Stripe 웹훅 |
| 🌍 모든 웹사이트에 열려 있는 CORS | 🚨 오류 모니터링 없음 |
| 🔒 개인정보처리방침 없음 | 🔗 제목, 설명 또는 공유 이미지 누락 |

## 옵션

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
NO_COLOR=1로 설정하면 컬러 출력을 끌 수 있습니다.

특정 줄을 가리키는 문제를 `// preflight-ignore <check-id>` 주석으로 해당 줄 또는 바로 위 줄에 적어 무시할 수 있습니다. 파일 전체에 대한 문제(커밋된 `.env`, 검증되지 않은 웹훅)는 파일의 처음 다섯 줄 안에 같은 주석을 적습니다. 프로젝트 전체에서 없애고 싶은 것, 파일이 없는 문제를 포함해, `--ignore <check-id>`를 사용합니다.

## CI에서 사용하기

```yaml
- run: npx vibe-preflight --fail-on critical
```

문제가 `--fail-on` 수준에 도달하면 명령이 종료 코드 1로 끝나므로, 유출된 키는 머지를 막습니다.

## Claude Code 안에서 사용하기

Preflight는 `/preflight` 명령이 포함된 Claude Code 플러그인으로 제공되며, 스캔을 실행하고 결과를 설명하며, 중요한 문제를 하나씩 수정하도록 제안하고, 모든 변경 전에 묻습니다.

Claude Code에서 실행:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

그런 다음 어떤 프로젝트에서든 `/preflight`를 입력하세요.

## 10분 만에 검사 추가하기

각 검사는 작은 파일 하나와 예시 폴더 두 개(하나는 반드시 문제를 찾아야 하고, 하나는 그대로 두어야 합니다)로 이루어집니다. 빌드 단계도, 의존성도 없습니다. [CONTRIBUTING.md](../CONTRIBUTING.md)를 읽거나 [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22) 라벨이 붙은 이슈 중 하나를 선택하세요.

## 보안 감사가 아닙니다

Preflight는 빠른 패턴 검사로 흔하면서도 영향이 큰 실수를 잡아냅니다. 깨끗한 리포트는 검사가 문제를 발견하지 못했다는 뜻이지, 앱이 안전하다는 뜻이 아닙니다. 리뷰를 대신하는 것이 아니라 안전벨트처럼 사용하세요.

## FAQ

**Preflight가 내 코드를 어딘가로 보내나요?**

아니요. Preflight는 로컬 컴퓨터에서만 실행되며, 네트워크 호출을 하지 않고, 텔레메트리를 수집하지 않습니다. 코드는 절대 컴퓨터를 떠나지 않습니다.

**100/100 점수가 내 앱이 안전하다는 뜻인가요?**

아니요. Preflight의 어떤 검사도 문제를 발견하지 못했다는 뜻일 뿐입니다. 자세한 내용은 [보안 감사가 아닙니다](#보안-감사가-아닙니다) 섹션을 참조하세요.

**오탐(false positive)을 어떻게 무시하나요?**

영향받는 줄에 `// preflight-ignore <check-id>`를 적거나 Preflight를 실행할 때 `--ignore <check-id>`를 사용하세요. 검사를 개선할 수 있도록 "False positive" 라벨 또는 제목으로 GitHub 이슈도 열어 주세요.

**어떤 스택을 이해하나요?**

Preflight는 어떤 프로젝트의 파일도 스캔할 수 있지만, Next.js, Vite, Supabase, Stripe, Express, 일반 HTML에서 검사가 가장 잘 동작합니다.

**심볼릭 링크 파일이 검사되지 않는 이유는 무엇인가요?**

심볼릭 링크는 파일이든 폴더든 의도적으로 건너뜁니다. 따라가면 무한 루프에 빠질 수 있습니다 — 자기 자신을 가리키는 폴더는 끝나지 않습니다 — 그리고 Preflight에 스캔을 요청한 프로젝트 밖의 파일을 읽을 수 있습니다. 따라서 다른 곳의 파일을 가리키는 `.env` 심볼릭 링크는 보고되지 않습니다. 프로젝트 안으로 복사하거나, 해당 파일을 실제로 보관하는 폴더를 가리키세요. `src/project.js`의 `walk`에 대한 주석도 코드 옆에 같은 내용을 말하고 있습니다.

## 라이선스

[MIT](../LICENSE). 어떤 용도로든 무료입니다.

## 기여자

Preflight를 더 좋게 만들어 주신 모든 분께 감사드립니다! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
