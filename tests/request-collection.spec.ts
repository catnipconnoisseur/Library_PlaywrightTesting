import { test, expect, Page } from '@playwright/test';

async function navigateToLibraryMenu(page: Page) {
  await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const loading = page.locator('text=/Preparing your dashboard|Loading/i').first();
  if (await loading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  const mainMenuDialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
  const menuToggle = page.locator('button:has(.fa-bars), .navbar-toggler, [data-bs-toggle="offcanvas"]').first();
  if (!await mainMenuDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
    await menuToggle.click({ timeout: 30000 });
  }
  await expect(mainMenuDialog).toBeVisible();

  const myActivityLink = mainMenuDialog.getByRole('link', { name: 'My Activity' });
  if (await myActivityLink.getAttribute('aria-expanded') !== 'true') {
    await myActivityLink.click();
  }

  const libraryButton = mainMenuDialog.getByRole('button', { name: 'Library' }).first();
  if (await libraryButton.getAttribute('aria-expanded') !== 'true') {
    await libraryButton.click();
  }
}

test.describe('UT4 - Request Collection', () => {

  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({ content: '.select2-drop-mask { display: none !important; pointer-events: none !important; }' });
    await navigateToLibraryMenu(page);
  });

  test('UT4-1: Mengakses Form Request Collection', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('button', { name: /Library Req.*Collection|Library New Collection/i }).click();
    await dialog.getByRole('link', { name: /^Form$/i }).click();

    await expect(page.locator('body')).toContainText(/Request Collection|Form/i);
    const formElement = page.locator('form, [class*="form"], [class*="request"]').first();
    await expect(formElement).toBeVisible();
  });

  test('UT4-2: Mengisi dan Mengirim Form Request Collection (Valid)', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('button', { name: /Library Req.*Collection|Library New Collection/i }).click();
    await dialog.getByRole('link', { name: /^Form$/i }).click();

    const jenisKoleksiSelect = page.locator('select').first();
    await jenisKoleksiSelect.selectOption({ label: 'Hardcover' });

    const randomSuffix = Date.now().toString().slice(-6);
    const judulInput = page.locator('input[name*="title" i], input[name*="judul" i], input[placeholder*="title" i], input[placeholder*="judul" i]').filter({ visible: true }).first();
    await judulInput.fill('Fisika ' + randomSuffix);

    const pengarangInput = page.locator('input[name*="author" i], input[name*="pengarang" i], input[placeholder*="author" i], input[placeholder*="pengarang" i]').filter({ visible: true }).first();
    await pengarangInput.fill('Salvador Samuel Molina Burgos');

    const penerbitInput = page.locator('input[name*="publisher" i], input[name*="penerbit" i], input[placeholder*="publisher" i], input[placeholder*="penerbit" i]').filter({ visible: true }).first();
    await penerbitInput.fill('Giltza');

    const isbnInput = page.locator('input[name*="isbn" i], input[placeholder*="isbn" i]').filter({ visible: true }).first();
    await isbnInput.fill('8483' + randomSuffix);

    const edisiInput = page.locator('input[name*="edition" i], input[name*="edisi" i], input[placeholder*="edition" i], input[placeholder*="edisi" i]').filter({ visible: true }).first();
    await edisiInput.fill('1');

    const tahunInput = page.locator('input[name*="year" i], input[name*="tahun" i], input[placeholder*="year" i], input[placeholder*="tahun" i]').filter({ visible: true }).first();
    await tahunInput.fill('2016');

    await page.getByRole('button', { name: /Submit data|Submit/i }).click();

    await expect(page.locator('body')).toContainText(/berhasil|success|submitted|tersimpan/i);
  });

  test('UT4-3: Mengisi dan Mengirim Form Request Collection (Invalid)', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('button', { name: /Library Req.*Collection|Library New Collection/i }).click();
    await dialog.getByRole('link', { name: /^Form$/i }).click();

    // Submit form with all fields empty
    await page.getByRole('button', { name: /Submit data|Submit/i }).click();

    // Expect that no success message is shown since it's invalid
    await expect(page.locator('body')).not.toContainText(/berhasil|success|submitted|tersimpan/i);
  });

  test('UT4-4: Mengakses dan Melihat Data Request Collection', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('button', { name: /Library Req.*Collection|Library New Collection/i }).click();
    await dialog.getByRole('link', { name: /^Data$/i }).click();

    await expect(page.locator('body')).toContainText(/Data|Request Collection/i);
    const dataTable = page.locator('table, .data-list, [class*="data"]').first();
    await expect(dataTable).toBeVisible();
  });

  test('UT4-5: Mencari Data Form yang Telah Diisi', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('button', { name: /Library Req.*Collection|Library New Collection/i }).click();
    await dialog.getByRole('link', { name: /^Data$/i }).click();

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="cari" i]').filter({ visible: true }).first();
    await searchInput.fill('fisika');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const resultRows = page.locator('table tbody tr, .data-item, [class*="item"]');
    const count = await resultRows.count();
    expect(count).toBeGreaterThan(0);

    await expect(page.locator('body')).toContainText(/fisika/i);
  });

});
