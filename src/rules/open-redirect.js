// Redirects (`res.redirect`, Next.js `redirect`) whose target comes
// straight from user input, with no allow-list check.
const QUERY_REDIRECT = /\.redirect\s*\(\s*req\.(query|body|params|headers)\b/;
const SEARCH_PARAMS_REDIRECT = /\bredirect\s*\(\s*[\w.]*searchParams\.get\s*\(/;

export default {
  id: 'open-redirect',
  title: 'Redirect uses unvalidated user input',
  category: 'security',
  severity: 'warning',
  check(project) {
    const files = project.files.filter((f) => /\.(js|mjs|cjs|jsx|ts|tsx)$/.test(f));
    const findings = [];
    for (const file of files) {
      project.lines(file).forEach((line, i) => {
        if (/^\s*\/\//.test(line)) return;
        if (QUERY_REDIRECT.test(line) || SEARCH_PARAMS_REDIRECT.test(line)) {
          findings.push({
            file,
            line: i + 1,
            message: 'Redirect target comes from user input, so an attacker can send victims to a malicious site.',
            fix: 'Allow only relative paths or a known host list before redirecting.',
          });
        }
      });
    }
    return findings;
  },
};
