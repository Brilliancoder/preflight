<div align="center">

# ✈️ Preflight

**Seu app feito com vibe coding está pronto para o lançamento? Descubra com um comando.**

O Preflight escaneia seu projeto em busca de chaves vazadas, bancos de dados abertos, pagamentos não verificados e fundamentos de lançamento faltantes, e então te dá um boletim com uma correção para cada achado.

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

Sem instalação, sem conta, sem chamadas de rede. Seu código nunca sai da sua máquina.

## Por quê

As ferramentas de IA facilitam criar um app em um fim de semana, e facilitam na mesma medida enviar sua chave secreta do Stripe dentro do bundle do navegador ou uma tabela do Supabase que qualquer um pode ler. O Preflight verifica os erros que mais doem depois do lançamento, antes do lançamento.

## Teste primeiro em um app quebrado

```bash
npx vibe-preflight --demo
```

Escaneia um app de demonstração deliberadamente quebrado (todos os segredos são falsos) para você ver como é um relatório com falhas.

## O que ele verifica

17 verificações hoje, cobrindo segurança, confiabilidade e fundamentos de lançamento. Veja [todas as verificações](rules.md).

| | |
|---|---|
| 🔑 Segredos ativos no código do cliente | 🗄️ Tabelas do Supabase sem segurança em nível de linha |
| 📄 Arquivos `.env` que podem ser commitados | 💳 Webhooks do Stripe sem verificação de assinatura |
| 🌍 CORS aberto para todos os sites | 🚨 Sem monitoramento de erros |
| 🔒 Sem política de privacidade | 🔗 Título, descrição ou imagem de compartilhamento ausentes |

## Opções

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```

Defina NO_COLOR=1 para desativar a saída colorida.

Silencie um achado que aponta para uma linha com `// preflight-ignore <check-id>` nessa linha ou na linha acima. Um achado sobre um arquivo inteiro (um `.env` commitado, um webhook não verificado) leva o mesmo comentário nas cinco primeiras linhas do arquivo. Tudo o que você quiser remover em todo o projeto, incluindo achados sem arquivo, usa `--ignore <check-id>`.

## Usando no CI

```yaml
- run: npx vibe-preflight --fail-on critical
```

O comando termina com o código 1 quando um achado atinge o nível `--fail-on`, então uma chave vazada bloqueia o merge.

## Usando dentro do Claude Code

O Preflight vem como um plugin do Claude Code com um comando `/preflight` que executa o escaneamento, explica os resultados e oferece corrigir os problemas críticos um por um, perguntando antes de cada mudança.

No Claude Code, execute:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Depois digite `/preflight` em qualquer projeto.

## Adicione uma verificação em 10 minutos

Cada verificação é um arquivo pequeno mais duas pastas de exemplo, uma que ela deve sinalizar e outra que ela deve deixar em paz. Sem etapa de build, sem dependências. Leia [CONTRIBUTING.md](../CONTRIBUTING.md), ou escolha uma issue com o rótulo [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## Não é uma auditoria de segurança

O Preflight pega erros comuns e de alto impacto com verificações rápidas por padrões. Um relatório limpo significa que nenhuma de suas verificações disparou, não que seu app é seguro. Use-o como um cinto de segurança, não como substituto de uma revisão.

## FAQ

**O Preflight envia meu código para algum lugar?**

Não. O Preflight roda inteiramente na sua máquina local, não faz chamadas de rede e não coleta telemetria. Seu código nunca sai do seu computador.

**Uma pontuação de 100/100 significa que meu app é seguro?**

Não. Significa apenas que nenhuma verificação do Preflight detectou um problema. Veja a seção [Não é uma auditoria de segurança](#não-é-uma-auditoria-de-segurança) para mais detalhes.

**Como silenciar um falso positivo?**

Use `// preflight-ignore <check-id>` na linha afetada ou `--ignore <check-id>` ao executar o Preflight. Abra também uma issue no GitHub com o rótulo ou título "False positive" para que a verificação possa ser melhorada.

**Quais stacks ele entende?**

O Preflight pode escanear os arquivos de qualquer projeto, mas suas verificações funcionam melhor com Next.js, Vite, Supabase, Stripe, Express e HTML puro.

**Por que um arquivo com link simbólico não é verificado?**

Links simbólicos são ignorados de propósito, arquivos e pastas. Segui-los pode entrar em loop — uma pasta ligada a si mesma nunca termina — e pode ler arquivos fora do projeto que você pediu ao Preflight para escanear. Um `.env` que é um link simbólico para um arquivo em outro lugar, portanto, não é reportado; copie-o para dentro do projeto, ou aponte a verificação para a pasta que realmente o contém. O comentário sobre `walk` em `src/project.js` diz o mesmo ao lado do código.

## Licença

[MIT](../LICENSE). Gratuito para qualquer uso.

## Contribuidores

Obrigado a todos que tornaram o Preflight melhor! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
