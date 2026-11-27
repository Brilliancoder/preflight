<div align="center">

# ✈️ Preflight

**¿Tu app hecha con vibe coding está lista para lanzar? Descúbrelo con un comando.**

Preflight escanea tu proyecto en busca de claves filtradas, bases de datos abiertas, pagos sin verificar y fundamentos de lanzamiento faltantes, y luego te da una ficha de resultados con una corrección para cada hallazgo.

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

Sin instalación, sin cuenta, sin llamadas de red. Tu código nunca sale de tu máquina.

## Por qué

Las herramientas de IA facilitan crear una app en un fin de semana, y facilitan en la misma medida enviar tu clave secreta de Stripe dentro del bundle del navegador o una tabla de Supabase que cualquiera puede leer. Preflight revisa los errores que más duelen después del lanzamiento, antes del lanzamiento.

## Pruébalo primero en una app rota

```bash
npx vibe-preflight --demo
```

Escanea una app de demostración deliberadamente rota (todos los secretos son falsos) para ver cómo es un informe con fallos.

## Qué verifica

17 verificaciones hoy, que cubren seguridad, fiabilidad y fundamentos de lanzamiento. Ver [todas las verificaciones](rules.md).

| | |
|---|---|
| 🔑 Secretos activos en el código del cliente | 🗄️ Tablas de Supabase sin seguridad a nivel de fila |
| 📄 Archivos `.env` que se pueden commitear | 💳 Webhooks de Stripe sin verificación de firma |
| 🌍 CORS abierto a todos los sitios web | 🚨 Sin monitoreo de errores |
| 🔒 Sin política de privacidad | 🔗 Título, descripción o imagen para compartir faltantes |

## Opciones

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
Define NO_COLOR=1 para desactivar la salida en color.

Silencia un hallazgo que apunta a una línea con `// preflight-ignore <check-id>` en esa línea o en la de arriba. Un hallazgo sobre un archivo entero (un `.env` commiteado, un webhook sin verificar) lleva el mismo comentario en las cinco primeras líneas del archivo. Todo lo que quieras eliminar en todo el proyecto, incluidos los hallazgos sin archivo, usa `--ignore <check-id>`.

## Usarlo en CI

```yaml
- run: npx vibe-preflight --fail-on critical
```

El comando termina con el código 1 cuando un hallazgo alcanza el nivel `--fail-on`, así que una clave filtrada bloquea el merge.

## Usarlo dentro de Claude Code

Preflight viene como un plugin de Claude Code con un comando `/preflight` que ejecuta el escaneo, explica los resultados y ofrece corregir los problemas críticos uno por uno, preguntando antes de cada cambio.

En Claude Code, ejecuta:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Luego escribe `/preflight` en cualquier proyecto.

## Añade una verificación en 10 minutos

Cada verificación es un archivo pequeño más dos carpetas de ejemplo, una que debe señalar y otra que debe dejar en paz. Sin paso de build, sin dependencias. Lee [CONTRIBUTING.md](../CONTRIBUTING.md), o elige un issue con la etiqueta [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## No es una auditoría de seguridad

Preflight atrapa errores comunes y de alto impacto con verificaciones rápidas por patrones. Un informe limpio significa que ninguna de sus verificaciones se activó, no que tu app es segura. Úsalo como un cinturón de seguridad, no como sustituto de una revisión.

## Preguntas frecuentes

**¿Preflight envía mi código a algún lugar?**

No. Preflight corre por completo en tu máquina local, no hace llamadas de red y no recopila telemetría. Tu código nunca sale de tu computadora.

**¿Una puntuación de 100/100 significa que mi app es segura?**

No. Solo significa que ninguna verificación de Preflight detectó un problema. Ver la sección [No es una auditoría de seguridad](#no-es-una-auditoría-de-seguridad) para más detalles.

**¿Cómo silencio un falso positivo?**

Usa `// preflight-ignore <check-id>` en la línea afectada o `--ignore <check-id>` al ejecutar Preflight. Abre también un issue de GitHub con la etiqueta o el título «False positive» para que la verificación pueda mejorarse.

**¿Qué stacks entiende?**

Preflight puede escanear los archivos de cualquier proyecto, pero sus verificaciones funcionan mejor con Next.js, Vite, Supabase, Stripe, Express y HTML simple.

**¿Por qué no se verifica un archivo con enlace simbólico?**

Los enlaces simbólicos se ignoran a propósito, archivos y carpetas. Seguirlos puede entrar en bucle — una carpeta enlazada a sí misma nunca termina — y puede leer archivos fuera del proyecto que le pediste a Preflight que escanee. Un `.env` que es un enlace simbólico a un archivo en otro lugar, por tanto, no se reporta; cópialo dentro del proyecto, o apunta la verificación a la carpeta que realmente lo contiene. El comentario sobre `walk` en `src/project.js` dice lo mismo junto al código.

## Licencia

[MIT](../LICENSE). Gratis para cualquier uso.

## Contribuidores

¡Gracias a todas las personas que hicieron Preflight mejor! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
