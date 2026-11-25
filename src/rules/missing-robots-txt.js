import { existsSync } from 'node:fs';
import path from 'node:path';

const HTML_ENTRY = /(?:^|\/)index\.html$/;
const NEXT_ENTRY = /^((?:.*\/)?)((?:src\/)?)(app\/layout|pages\/_app)\.(?:tsx|jsx|js|ts)$/;

const anyExists = (root, paths) => paths.some((p) => existsSync(path.join(root, p)));

const staticRobots = (dir) => [`${dir}robots.txt`, `${dir}public/robots.txt`];

export default {
  id: 'missing-robots-txt',
  title: 'No robots.txt',
  category: 'launch',
  severity: 'info',
  check(project) {
    const findings = [];
    for (const file of project.files) {
      let candidates;
      if (HTML_ENTRY.test(file) && !file.includes('/dist/')) {
        candidates = staticRobots(file.slice(0, -'index.html'.length));
      } else {
        const m = NEXT_ENTRY.exec(file);
        if (!m) continue;
        const [, dir, src] = m;
        const routes = ['txt', 'ts', 'js', 'tsx', 'jsx'].map((ext) => `${dir}${src}app/robots.${ext}`);
        candidates = [...routes, ...staticRobots(dir)];
      }
      if (!anyExists(project.root, candidates)) {
        findings.push({
          file,
          message: 'No robots.txt: crawlers get a 404 and have no pointer to your sitemap.',
          fix: 'Add public/robots.txt (or app/robots.ts in Next.js) that allows crawling and links your sitemap.',
        });
      }
    }
    return findings;
  },
};
