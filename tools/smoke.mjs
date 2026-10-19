import { chromium } from 'playwright';
// Smoke test: run `npm run build && npm run preview`, then `node tools/smoke.mjs [outDir]`.
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'qa-shots';
fs.mkdirSync(OUT, { recursive: true });
const base = 'http://localhost:4173';
const b = await chromium.launch();
const errors = [];
async function run(name, viewport, steps) {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: 1, hasTouch: viewport.width < 800, isMobile: viewport.width < 800 });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${name}] ${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`[${name}] pageerror: ${e.message}`));
  p.on('requestfailed', (r) => errors.push(`[${name}] failed: ${r.url()}`));
  p.on('response', (r) => { if (r.status() >= 400) errors.push(`[${name}] ${r.status()}: ${r.url()}`); });
  await steps(p);
  await ctx.close();
}
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` });
const overflow = async (p, n) => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 0) errors.push(`[${n}] horizontal overflow ${o}px`); };
const scrollTo = async (p, sel) => { await p.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY); }, sel); await p.waitForTimeout(2200); };

await run('desktop', { width: 1440, height: 900 }, async (p) => {
  await p.goto(base + '/');
  await p.waitForTimeout(900); await shot(p, 'd0-intro');
  await p.waitForTimeout(4500); await shot(p, 'd1-hero');
  for (const s of ['#about', '#projects', '#info']) { await scrollTo(p, s); await shot(p, 'd-' + s.slice(1)); }
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#about').offsetTop + 900)); await p.waitForTimeout(1800); await shot(p, 'd-about2');
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#projects').offsetTop + 1100)); await p.waitForTimeout(1800); await shot(p, 'd-projects2');
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#projects').offsetTop + 2300)); await p.waitForTimeout(1800); await shot(p, 'd-projects3');
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(1800); await shot(p, 'd-end');
  await overflow(p, 'desktop-home');
  // open a project via the card transition
  await scrollTo(p, '#projects');
  await p.click('#projects a[href="/projects/branding"]');
  await p.waitForTimeout(600); await shot(p, 'd-trans');
  await p.waitForTimeout(2600); await shot(p, 'd-project');
  const url = p.url(); if (!url.endsWith('/projects/branding')) errors.push('nav failed: ' + url);
  for (const y of [1, 2, 3, 4, 5]) { await p.evaluate((y) => window.scrollTo(0, innerHeight * y * 1.1), y); await p.waitForTimeout(1600); await shot(p, 'd-project-' + y); }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(1500); await shot(p, 'd-project-end');
  await overflow(p, 'desktop-project');
  await p.click('nav[aria-label="Next project"] a'); await p.waitForTimeout(3200);
  if (!p.url().endsWith('/projects/3d-motion')) errors.push('next failed ' + p.url());
  await shot(p, 'd-next');
  await p.click('text=All projects'); await p.waitForTimeout(2800); await shot(p, 'd-back');
  await p.click('button[aria-controls="site-menu"]'); await p.waitForTimeout(1500); await shot(p, 'd-menu');
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  await p.goto(base + '/does-not-exist'); await p.waitForTimeout(2000); await shot(p, 'd-404');
  await p.goto(base + '/projects/nope'); await p.waitForTimeout(2000); await shot(p, 'd-404b');
});

await run('mobile', { width: 390, height: 844 }, async (p) => {
  await p.goto(base + '/'); await p.waitForTimeout(5500); await shot(p, 'm1-hero');
  for (const s of ['#about', '#projects', '#info']) { await scrollTo(p, s); await shot(p, 'm-' + s.slice(1)); }
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#about').offsetTop + 800)); await p.waitForTimeout(1500); await shot(p, 'm-about2');
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#projects').offsetTop + 900)); await p.waitForTimeout(1500); await shot(p, 'm-projects2');
  await overflow(p, 'mobile-home');
  await p.goto(base + '/projects/visual-identity'); await p.waitForTimeout(2500); await shot(p, 'm-project');
  await p.evaluate(() => window.scrollTo(0, innerHeight * 1.2)); await p.waitForTimeout(1500); await shot(p, 'm-project2');
  await overflow(p, 'mobile-project');
  await p.evaluate(() => window.scrollTo(0, innerHeight * 0.5)); await p.waitForTimeout(800);
  await p.click('button[aria-controls="site-menu"]'); await p.waitForTimeout(1500); await shot(p, 'm-menu');
});

await run('tablet', { width: 820, height: 1180 }, async (p) => {
  await p.goto(base + '/'); await p.waitForTimeout(5500); await shot(p, 't1-hero');
  await scrollTo(p, '#projects'); await shot(p, 't-projects');
  await overflow(p, 'tablet-home');
});

console.log(errors.length ? errors.join('\n') : 'NO ERRORS');
await b.close();
