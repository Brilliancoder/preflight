// Firestore rules (`firestore.rules`) and Realtime Database rules
// (`database.rules.json`) that let anyone read or write.
const FIRESTORE_OPEN = /allow\s+[^:;]*\b(read|write)\b[^:;]*:\s*if\s+true\s*;/;
const RTDB_OPEN = /"\.(read|write)"\s*:\s*true/;

export default {
  id: 'firebase-rules-open',
  title: 'Firebase rules let anyone read or write',
  category: 'security',
  severity: 'critical',
  check(project) {
    const files = project.files.filter(
      (f) => /(^|\/)firestore\.rules$/.test(f) || /(^|\/)database\.rules\.json$/.test(f),
    );
    const findings = [];
    for (const file of files) {
      const isRules = file.endsWith('firestore.rules');
      project.lines(file).forEach((line, i) => {
        if (isRules && /^\s*\/\//.test(line)) return;
        const m = line.match(isRules ? FIRESTORE_OPEN : RTDB_OPEN);
        if (m) {
          findings.push({
            file,
            line: i + 1,
            message: `Firebase rules let anyone ${m[1]} this data.`,
            fix: 'Require `request.auth != null` and scope each rule to the documents that user may access.',
          });
        }
      });
    }
    return findings;
  },
};
