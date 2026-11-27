// An app that takes payments (a Stripe, Lemon Squeezy, Paddle or
// RevenueCat dependency) with no terms page or route.
const CODE = /\.(?:js|jsx|mjs|ts|tsx|vue|svelte|html|astro|dart|swift|kt|py)$/;
const TERMS = /terms/i;
const TERMS_URL = /https?:\/\/[^\s"'`<>]*terms[^\s"'`<>]*/i;
const PAYMENT_DEP = /^(stripe|@stripe\/|@lemonsqueezy\/|@paddle\/|@revenuecat\/|react-native-purchases|revenuecat)/;

function takesPayments(text) {
  try {
    const pkg = JSON.parse(text);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return Object.keys(deps).some((d) => PAYMENT_DEP.test(d));
  } catch {
    return /"(stripe|@stripe\/[^\"]*|@lemonsqueezy\/[^\"]*|@paddle\/[^\"]*|@revenuecat\/[^\"]*|react-native-purchases)"/.test(text);
  }
}

export default {
  id: 'no-terms-of-service',
  title: 'No terms of service',
  category: 'launch',
  severity: 'warning',
  check(project) {
    // A terms page the app ships silences the check.
    if (project.files.some((f) => TERMS.test(f))) return [];
    const payer = project.files.find((f) => /(^|\/)package\.json$/.test(f) && takesPayments(project.read(f)));
    if (!payer) return [];
    if (project.files.some((f) => CODE.test(f) && TERMS_URL.test(project.read(f)))) return [];
    return [{
      file: payer,
      line: 1,
      message: 'The app takes payments but has no terms of service page. Payment providers and consumer laws require one.',
      fix: 'Add a /terms page that covers pricing, refunds, cancellations and acceptable use.',
    }];
  },
};
