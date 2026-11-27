import { isClientFile } from './_client-paths.js';

const LOCALHOST = /https?:\/\/localhost\b|\b127\.0\.0\.1\b/;
const PROD_CONFIG = /(^|\/)(\.env\.production|vercel\.json|app\.json)$/;
const SKIP = /(^|\/)(__tests__|tests?|spec)\/|\.(test|spec)\.[^.]+$|(^|\/)README(\.|$)/i;
const SKIP_ENV_DEV = /(^|\/)\.env\.development$/;

export default {
  id: 'localhost-url-in-prod-config',
  title: 'Localhost URL in production code',
  category: 'reliability',
  severity: 'warning',
  check(project) {
    const findings = [];
    for (const file of project.files) {
      if (SKIP.test(file) || SKIP_ENV_DEV.test(file)) continue;
      const isConfig = PROD_CONFIG.test(file);
      if (!isConfig && !isClientFile(file, project.read(file))) continue;
      project.lines(file).forEach((line, i) => {
        if (/^\s*(\/\/|#)/.test(line)) return;
        if (LOCALHOST.test(line)) {
          findings.push({
            file,
            line: i + 1,
            message: 'Localhost URL will not work in production.',
            fix: 'Move the URL into an environment variable and set it per environment.',
          });
        }
      });
    }
    return findings;
  },
};
