import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixtureProject } from '../helpers.js';
import cors from '../../src/rules/cors-wildcard.js';
import monitoring from '../../src/rules/no-error-monitoring.js';
import privacy from '../../src/rules/no-privacy-policy.js';
import meta from '../../src/rules/missing-meta-tags.js';
import favicon from '../../src/rules/missing-favicon.js';
import robots from '../../src/rules/missing-robots-txt.js';

test('cors-wildcard flags cors() with no options and a * header', async () => {
  const f = cors.check(await fixtureProject('cors-wildcard', 'bad'));
  assert.deepEqual(f.map((x) => `${x.file}:${x.line}`).sort(), ['api/x.ts:2', 'server.js:2']);
  assert.equal(cors.severity, 'warning');
});

test('cors-wildcard is quiet with an origin list', async () => {
  assert.deepEqual(cors.check(await fixtureProject('cors-wildcard', 'good')), []);
});

test('no-error-monitoring flags a JS app with no monitoring dependency', async () => {
  const f = monitoring.check(await fixtureProject('no-error-monitoring', 'bad'));
  assert.equal(f.length, 1);
  assert.equal(f[0].file, 'package.json');
  assert.equal(monitoring.category, 'reliability');
  assert.equal(monitoring.severity, 'info');
});

test('no-error-monitoring is quiet with Sentry, or when there is no package.json', async () => {
  assert.deepEqual(monitoring.check(await fixtureProject('no-error-monitoring', 'good')), []);
  assert.deepEqual(monitoring.check(await fixtureProject('no-error-monitoring', 'good-no-js')), []);
});

test('no-privacy-policy flags an app with sign-up and no privacy page', async () => {
  const f = privacy.check(await fixtureProject('no-privacy-policy', 'bad'));
  assert.equal(f.length, 1);
  assert.equal(privacy.category, 'launch');
});

test('no-privacy-policy is quiet with a privacy page or without auth', async () => {
  assert.deepEqual(privacy.check(await fixtureProject('no-privacy-policy', 'good')), []);
  assert.deepEqual(privacy.check(await fixtureProject('no-privacy-policy', 'good-no-auth')), []);
});

test('missing-meta-tags names the missing tags', async () => {
  const f = meta.check(await fixtureProject('missing-meta-tags', 'bad'));
  assert.equal(f.length, 1);
  assert.equal(f[0].file, 'index.html');
  assert.match(f[0].message, /description/);
  assert.match(f[0].message, /og:image/);
  assert.doesNotMatch(f[0].message, /title/);
});

test('missing-meta-tags is quiet for complete HTML and Next.js metadata', async () => {
  assert.deepEqual(meta.check(await fixtureProject('missing-meta-tags', 'good')), []);
  assert.deepEqual(meta.check(await fixtureProject('missing-meta-tags', 'good-next')), []);
});

test('missing-favicon flags an index.html with no icon', async () => {
  const f = favicon.check(await fixtureProject('missing-favicon', 'bad'));
  assert.equal(f.length, 1);
  assert.equal(f[0].file, 'index.html');
  assert.equal(favicon.category, 'launch');
  assert.equal(favicon.severity, 'info');
});

test('missing-favicon is quiet with public/favicon.ico, a <link rel="icon"> or Next.js app/favicon.ico', async () => {
  assert.deepEqual(favicon.check(await fixtureProject('missing-favicon', 'good')), []);
  assert.deepEqual(favicon.check(await fixtureProject('missing-favicon', 'good-vite')), []);
  assert.deepEqual(favicon.check(await fixtureProject('missing-favicon', 'good-next')), []);
});

test('missing-robots-txt flags a Vite app with no public/robots.txt', async () => {
  const f = robots.check(await fixtureProject('missing-robots-txt', 'bad'));
  assert.equal(f.length, 1);
  assert.equal(f[0].file, 'index.html');
  assert.equal(robots.category, 'launch');
  assert.equal(robots.severity, 'info');
});

test('missing-robots-txt is quiet with public/robots.txt, Next.js app/robots.ts, or no website', async () => {
  assert.deepEqual(robots.check(await fixtureProject('missing-robots-txt', 'good')), []);
  assert.deepEqual(robots.check(await fixtureProject('missing-robots-txt', 'good-next')), []);
  assert.deepEqual(robots.check(await fixtureProject('missing-robots-txt', 'good-backend')), []);
});
