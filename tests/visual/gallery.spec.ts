import { expect, test, type Page } from '@playwright/test';
import { themes } from '../../src/theme/registry.ts';

async function open(page: Page, path: string, theme: string, mode: string) {
  await page.context().addCookies([{ name: 'logmon_theme', value: `${theme}.${mode}`, url: 'http://127.0.0.1:4173' }]);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

for (const t of themes) {
  for (const scheme of ['light', 'dark'] as const) {
    if (!t[scheme]) continue;
    test(`overview ${t.id} ${scheme}`, async ({ page }) => {
      await open(page, '/', t.id, scheme);
      await expect(page.locator('html')).toHaveAttribute('data-scheme', scheme);
      await expect(page).toHaveScreenshot(`overview-${t.id}-${scheme}.png`);
    });
  }
}

for (const scheme of ['light', 'dark'] as const) {
  test(`components logmon ${scheme}`, async ({ page }) => {
    await open(page, '/components', 'logmon', scheme);
    await expect(page).toHaveScreenshot(`components-logmon-${scheme}.png`);
  });
}

test('mobile shell', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, '/', 'logmon', 'dark');
  await expect(page).toHaveScreenshot('mobile-overview.png');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page).toHaveScreenshot('mobile-nav.png');
});

test('system mode follows prefers-color-scheme without a flash of the other scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await open(page, '/', 'terracotta', 'system');
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'light');
});

test('theme picker writes the cookie and applies immediately', async ({ page }) => {
  await open(page, '/themes', 'logmon', 'dark');
  await page
    .getByRole('radio', { name: /Dracula/ })
    .first()
    .click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  const cookie = (await page.context().cookies()).find((c) => c.name === 'logmon_theme');
  expect(cookie?.value).toBe('dracula.dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
});

test('every gallery page renders without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const path of ['/', '/components', '/themes']) {
    await open(page, path, 'logmon', 'dark');
    await expect(page.locator('main h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
