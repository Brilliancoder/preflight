// A package.json with dependencies but no lockfile anywhere above it,
// so installs are not reproducible.
import { existsSync } from 'node:fs';
import path from 'node:path';

const LOCKFILES = ['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb'];

function hasDependencies(text) {
  try {
    const pkg = JSON.parse(text);
    return Boolean(
      (pkg.dependencies && Object.keys(pkg.dependencies).length) ||
      (pkg.devDependencies && Object.keys(pkg.devDependencies).length),
    );
  } catch {
    return /"(dependencies|devDependencies)"\s*:/.test(text);
  }
}

function dirOf(path) {
  const i = path.lastIndexOf('/');
  return i === -1 ? '' : path.slice(0, i);
}

export default {
  id: 'missing-lockfile',
  title: 'No lockfile for these dependencies',
  category: 'reliability',
  severity: 'info',
  check(project) {
    // Looked up on disk, not in project.files: the file list skips binary files (bun.lockb) and
    // anything over 1 MB, which a real package-lock.json often is.
    const checked = new Map();
    const lockDirs = {
      has(dir) {
        if (!checked.has(dir)) {
          checked.set(dir, LOCKFILES.some((name) => existsSync(path.join(project.root, dir, name))));
        }
        return checked.get(dir);
      },
    };
    const findings = [];
    for (const file of project.files) {
      if (!/(^|\/)package\.json$/.test(file)) continue;
      if (!hasDependencies(project.read(file))) continue;
      const dir = dirOf(file);
      // Quiet when a lockfile sits next to the package.json or at any
      // ancestor directory (monorepo root), covering workspaces.
      let covered = false;
      let at = dir;
      for (;;) {
        if (lockDirs.has(at)) { covered = true; break; }
        if (at === '') break;
        const slash = at.lastIndexOf('/');
        at = slash === -1 ? '' : at.slice(0, slash);
      }
      if (covered) continue;
      findings.push({
        file,
        line: 1,
        message: 'No lockfile, so installs are not reproducible.',
        fix: 'Commit a lockfile, for example by running `npm install`.',
      });
    }
    return findings;
  },
};
