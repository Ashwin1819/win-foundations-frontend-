import { test, expect, type Page } from '@playwright/test';

// Every public page reachable without login. Dynamic detail pages (campaign/
// initiative slugs) are resolved at runtime from the live API so this stays
// correct as content changes, instead of hardcoding slugs that might get
// deleted later.
const STATIC_PAGES = [
  '/',
  '/about',
  '/team',
  '/initiatives',
  '/campaigns',
  '/updates',
  '/blog',
  '/gallery',
  '/contact',
  '/donate',
  '/volunteer',
  '/partner',
  '/internship',
  '/cv-building',
  '/faq',
  '/privacy-policy',
  '/terms-conditions',
];

async function getDynamicPages(): Promise<string[]> {
  const api = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000/api';
  const pages: string[] = [];

  try {
    const res = await fetch(`${api}/campaigns`);
    const campaigns = await res.json();
    for (const c of campaigns.slice(0, 2)) pages.push(`/campaigns/${c.slug}`);
  } catch {
    // backend unavailable — dynamic pages just won't be added, static ones still run
  }

  try {
    const res = await fetch(`${api}/initiatives`);
    const initiatives = await res.json();
    for (const i of initiatives.slice(0, 2)) pages.push(`/initiatives/${i.slug}`);
  } catch {
    /* ignore */
  }

  return pages;
}

async function checkPage(page: Page, path: string) {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  // 'networkidle' never fires reliably against a Next.js dev server (its HMR
  // websocket stays open), so wait for DOM content + the heading instead.
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

  // 1. Loads with status 200
  expect(response?.status(), `${path} should return 200`).toBe(200);

  // 2. Has a visible heading
  const heading = page.locator('h1, h2').first();
  await expect(heading, `${path} should have a visible h1/h2`).toBeVisible({ timeout: 15000 });

  // Give client-side data fetches (many components load content via useEffect)
  // a moment to populate images before counting them.
  await page.waitForTimeout(1500);

  // 3. No broken images (naturalWidth 0 = failed to load, for <img> tags;
  //    Next.js <Image> renders as <img> too so this covers both). Wait for
  //    each image to finish loading (or fail) first instead of sampling
  //    naturalWidth mid-load, which produces false positives.
  const images = page.locator('img');
  const count = await images.count();
  const broken: string[] = [];
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src');
    if (!src) continue;
    // Next.js <Image> lazy-loads by default — scroll each one into view first,
    // otherwise below-the-fold images (e.g. the footer logo) never start
    // downloading and would falsely report as broken.
    await img.scrollIntoViewIfNeeded().catch(() => {});
    const naturalWidth = await img
      .evaluate(
        (el: HTMLImageElement) =>
          el.complete
            ? el.naturalWidth
            : new Promise<number>((resolve) => {
                el.addEventListener('load', () => resolve(el.naturalWidth), { once: true });
                el.addEventListener('error', () => resolve(0), { once: true });
                setTimeout(() => resolve(el.naturalWidth), 8000);
              }),
        { timeout: 10000 }
      )
      .catch(() => -1);
    if (naturalWidth === 0) broken.push(src);
  }
  expect(broken, `${path} should have no broken images:\n${broken.join('\n')}`).toHaveLength(0);

  // 4. No console errors (ignore known-benign Next.js dev-only warnings)
  const realErrors = consoleErrors.filter(
    (e) => !e.includes('Download the React DevTools') && !e.includes('fast-refresh')
  );
  expect(realErrors, `${path} should have no console errors:\n${realErrors.join('\n')}`).toHaveLength(0);
}

for (const path of STATIC_PAGES) {
  test(`${path} — loads, has heading, no broken images, no console errors`, async ({ page }) => {
    await checkPage(page, path);
  });
}

test.describe('dynamic detail pages', () => {
  test('campaign and initiative detail pages pass the same checks', async ({ page }) => {
    const dynamicPages = await getDynamicPages();
    test.skip(dynamicPages.length === 0, 'No campaigns/initiatives available from the API to test');
    for (const path of dynamicPages) {
      await checkPage(page, path);
    }
  });
});
