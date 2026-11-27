// A package.json with dependencies but no lockfile anywhere above it,
// so installs are not reproducible.
const LOCKFILES = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb']);

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
    const lockDirs = new Set();
    for (const file of project.files) {
      const base = file.slice(file.lastIndexOf('/') + 1);
      if (LOCKFILES.has(base)) lockDirs.add(dirOf(file));
    }
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
