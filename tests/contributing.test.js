import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import template from '../src/rules/_template.js';
import { loadRules } from '../src/rules/index.js';
import { CATEGORIES } from '../src/score.js';
import { fixtureProject } from './helpers.js';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

test('template rule passes the rule contract', () => {
  assert.equal(typeof template.id, 'string');
  assert.equal(typeof template.title, 'string');
  assert.ok(CATEGORIES.includes(template.category));
  assert.ok(['critical', 'warning', 'info'].includes(template.severity));
  assert.equal(typeof template.check, 'function');
});

test('every rule meets the contract and has good and bad fixtures', async () => {
  for (const rule of await loadRules()) {
    assert.match(rule.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, rule.id);
    assert.ok(CATEGORIES.includes(rule.category), rule.id);
    assert.ok(['critical', 'warning', 'info'].includes(rule.severity), rule.id);
    assert.ok(existsSync(root(`tests/fixtures/${rule.id}/good`)), `${rule.id}: missing good fixture`);
    assert.ok(existsSync(root(`tests/fixtures/${rule.id}/bad`)), `${rule.id}: missing bad fixture`);
  }
});

test('every rule flags its bad fixture with a fix, and passes its good fixture', async () => {
  for (const rule of await loadRules()) {
    const bad = rule.check(await fixtureProject(rule.id, 'bad'));
    assert.ok(bad.length > 0, `${rule.id}: bad fixture not flagged`);
    for (const f of bad) assert.ok(f.fix && f.message, `${rule.id}: finding without message or fix`);
    assert.deepEqual(rule.check(await fixtureProject(rule.id, 'good')), [], `${rule.id}: good fixture flagged`);
  }
});

test('every check title is short enough for the report card', async () => {
  for (const rule of await loadRules()) {
    assert.ok(rule.title.length <= 60, `${rule.id}: title is ${rule.title.length} characters`);
  }
});

test('every finding fix ends with a full stop', async () => {
  for (const rule of await loadRules()) {
    const bad = rule.check(await fixtureProject(rule.id, 'bad'));
    for (const f of bad) assert.ok(f.fix.endsWith('.'), `${rule.id}: fix does not end with a full stop`);
  }
});

test('contributor docs and templates exist', () => {
  for (const p of ['CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', '.github/pull_request_template.md', '.github/ISSUE_TEMPLATE/new-check.yml', '.github/ISSUE_TEMPLATE/false-positive.yml', '.github/workflows/ci.yml', 'docs/seed-issues.md']) {
    assert.ok(existsSync(root(p)), p);
  }
  const seeds = readFileSync(root('docs/seed-issues.md'), 'utf8');
  assert.ok((seeds.match(/^## /gm) ?? []).length >= 15, 'at least 15 seed issues');
});


test("every rule's id matches its file name", async () => {
    const dir = new URL('../src/rules/', import.meta.url);
    const names = (await readdir(dir)).filter((n) => n.endsWith('.js') && n !== 'index.js' && !n.startsWith('_'));
    assert.ok(names.length > 0, 'expected at least one rule file in src/rules/');
    for (const name of names) {
          const rule = (await import(new URL(name, dir))).default;
          assert.equal(rule.id, name.slice(0, -3), name);
    }
});
