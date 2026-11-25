import { existsSync } from 'node:fs';
import path from 'node:path';

const HTML_ENTRY = /(?:^|\/)index\.html$/;
const LAYOUT = /^((?:.*\/)?)((?:src\/)?app)\/layout\.(?:tsx|jsx|js|ts)$/;
const ICON_LINK = /<link[^>]+rel=["'](?:shortcut )?icon["']/i;
const NEXT_ICON_EXT = ['ico', 'png', 'jpg', 'jpeg', 'svg', 'js', 'ts', 'tsx', 'jsx'];

// Image files are not in project.files (the walker skips binaries), so check the disk.
const anyExists = (root, paths) => paths.some((p) => existsSync(path.join(root, p)));

const rootIcons = (dir) => ['', 'public/'].flatMap((d) => [`${dir}${d}favicon.ico`, `${dir}${d}icon.png`]);

export default {
  id: 'missing-favicon',
  title: 'No favicon',
  category: 'launch',
  severity: 'info',
  check(project) {
    const findings = [];
    for (const file of project.files) {
      let hasIcon;
      if (HTML_ENTRY.test(file) && !file.includes('/dist/')) {
        const dir = file.slice(0, -'index.html'.length);
        hasIcon = ICON_LINK.test(project.read(file)) || anyExists(project.root, rootIcons(dir));
      } else {
        const m = LAYOUT.exec(file);
        if (!m) continue;
        const [, dir, appDir] = m;
        const appIcons = ['favicon', 'icon'].flatMap((n) => NEXT_ICON_EXT.map((ext) => `${dir}${appDir}/${n}.${ext}`));
        hasIcon = /\bicons\s*:/.test(project.read(file)) || anyExists(project.root, [...appIcons, ...rootIcons(dir)]);
      }
      if (!hasIcon) {
        findings.push({
          file,
          message: 'No favicon: browser tabs and bookmarks will show a blank or default icon.',
          fix: 'Add public/favicon.ico (or app/icon.png in Next.js), or a <link rel="icon"> in your HTML.',
        });
      }
    }
    return findings;
  },
};
