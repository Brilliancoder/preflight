// Auth routes (Express or Next.js) in a project with no rate-limiting
// dependency installed.
const LIMITERS = /express-rate-limit|@upstash\/ratelimit|rate-limiter-flexible/;
const NEXT_AUTH_ROUTE =
  /(^|\/)api\/(login|signup|sign-up|register|reset-password|forgot-password)\/route\.(ts|js)$/;
const EXPRESS_AUTH_ROUTE =
  /(?:app|router)\.(?:post|all)\s*\(\s*['"`][^'"`]*\/(login|signup|sign-?up|register|reset-password|forgot-password)\b/;

export default {
  id: 'no-rate-limit-auth-route',
  title: 'Auth route without rate limiting',
  category: 'reliability',
  severity: 'warning',
  check(project) {
    if (LIMITERS.test(project.read('package.json'))) return [];
    const findings = [];
    for (const file of project.files) {
      if (NEXT_AUTH_ROUTE.test(file)) {
        findings.push({
          file,
          line: 1,
          message: 'Auth route has no rate limiting, so attackers can brute-force passwords.',
          fix: 'Add rate limiting to this auth route, for example with `express-rate-limit` or `@upstash/ratelimit`.',
        });
        continue;
      }
      if (!/\.(js|mjs|cjs|jsx|ts|tsx)$/.test(file)) continue;
      project.lines(file).forEach((line, i) => {
        if (/^\s*\/\//.test(line)) return;
        if (EXPRESS_AUTH_ROUTE.test(line)) {
          findings.push({
            file,
            line: i + 1,
            message: 'Auth route has no rate limiting, so attackers can brute-force passwords.',
            fix: 'Add rate limiting to this auth route, for example with `express-rate-limit` or `@upstash/ratelimit`.',
          });
        }
      });
    }
    return findings;
  },
};
