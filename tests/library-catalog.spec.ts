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

test.describe('UT1 - Library Page Access', () => {

  test('UT1-1: Mengakses Halaman Library', async ({ page }) => {
    await navigateToLibraryMenu(page);

    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await expect(dialog.getByRole('link', { name: 'Online Catalog' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'My Reservation Basket' })).toBeVisible();
  });

});

test.describe('UT2 - Online Catalog', () => {

  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({ content: '.select2-drop-mask { display: none !important; pointer-events: none !important; }' });
    await navigateToLibraryMenu(page);
  });

  test('UT2-1: Mengakses Online Catalog', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    await expect(page).toHaveURL(/.*catalog.*/i);
    await expect(page.locator('body')).toContainText(/catalog/i);
  });

  test('UT2-2: Melakukan Pencarian Buku Menggunakan Filter (Empty Title)', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const locationSelect = page.locator('select, [class*="select"]').filter({ hasText: /location/i }).first();
    if (await locationSelect.isVisible()) {
      await locationSelect.selectOption({ label: 'Universitas Ciputra Surabaya' });
    }

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('');

    await page.getByRole('button', { name: /Search/i }).click({ force: true });
    await page.waitForTimeout(3000); // Wait for AJAX or page load

    const resultTable = page.locator('table, .book-list, .catalog-list, .search-result, [class*="result"]').filter({ visible: true }).first();
    await expect(resultTable).toBeVisible({ timeout: 15_000 });
  });

  test('UT2-3: Melakukan Pencarian Buku Menggunakan Filter (Publisher Filter)', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const locationSelect = page.locator('select, [class*="select"]').filter({ hasText: /location/i }).first();
    if (await locationSelect.isVisible()) {
      await locationSelect.selectOption({ label: 'Universitas Ciputra Surabaya' });
    }

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('Masakan');

    const addFilterBtn = page.getByRole('button', { name: /Add Filter/i });
    if (await addFilterBtn.isVisible()) {
      await addFilterBtn.click({ force: true });
      const publisherOption = page.locator('text=/Publisher/i').first();
      if (await publisherOption.isVisible()) {
        await publisherOption.click({ force: true });
      }
    }

    await page.getByRole('button', { name: /Search/i }).click({ force: true });
    await page.waitForTimeout(3000); // Wait for AJAX or page load

    const resultTable = page.locator('table, .book-list, .catalog-list, .search-result, [class*="result"]').filter({ visible: true }).first();
    await expect(resultTable).toBeVisible({ timeout: 15_000 });
  });

  test('UT2-4: Melakukan Pencarian Buku Menggunakan Filter (Specific Title)', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const locationSelect = page.locator('select, [class*="select"]').filter({ hasText: /location/i }).first();
    if (await locationSelect.isVisible()) {
      await locationSelect.selectOption({ label: 'Universitas Ciputra Surabaya' });
    }

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('Masakan 123');

    await page.getByRole('button', { name: /Search/i }).click({ force: true });
    await page.waitForTimeout(3000); // Wait for AJAX or page load

    const resultTable = page.locator('table, .book-list, .catalog-list, .search-result, [class*="result"]').filter({ visible: true }).first();
    await expect(resultTable).toBeVisible({ timeout: 15_000 });
  });

  test('UT2-5: Melihat Detail Buku dan Memilih yang Akan Dipinjam', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('Masakan');
    await page.getByRole('button', { name: /Search/i }).click({ force: true });

    await page.waitForTimeout(3000);

    const bookRows = page.locator('table tbody tr, .book-item, .catalog-item, [class*="book"]');
    const bookCount = await bookRows.count();
    expect(bookCount).toBeGreaterThan(0);

    const checkboxes = page.locator('input[type="checkbox"]').filter({ visible: true });
    await expect(checkboxes.first()).toBeVisible({ timeout: 15_000 });
    const maxSelect = Math.min(3, await checkboxes.count());
    for (let i = 0; i < maxSelect; i++) {
      await checkboxes.nth(i).check({ force: true });
      await page.waitForTimeout(500); // Prevent fast click flakiness
    }
  });

  test('UT2-6: Menghubungi PIC Library', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: /Asking Librarian|Tanya Librarian/i }).click();
    const popup = await popupPromise;

    expect(popup.url()).toContain('whatsapp.com');
  });

  test('UT2-7: Menambahkan Buku ke Reservation Basket', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const locationSelect = page.locator('select, [class*="select"]').filter({ hasText: /location/i }).first();
    if (await locationSelect.isVisible()) {
      await locationSelect.selectOption({ label: 'Universitas Ciputra Surabaya' });
    }

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('Olahraga');
    await page.getByRole('button', { name: /Search/i }).click({ force: true });

    await page.waitForTimeout(3000);

    const firstCheckbox = page.locator('input[type="checkbox"]').filter({ visible: true }).first();
    await firstCheckbox.check();

    await page.getByRole('button', { name: /Add to Basket/i }).click({ force: true });

    await expect(page.locator('body')).toContainText(/berhasil|success|added/i);
  });

  test('UT2-8: Menghapus Data Basket Sebelumnya', async ({ page }) => {
    const dialog = page.locator('dialog, .offcanvas, .modal').filter({ hasText: 'Main Menu' }).first();
    await dialog.getByRole('link', { name: 'Online Catalog' }).click();

    const locationSelect = page.locator('select, [class*="select"]').filter({ hasText: /location/i }).first();
    if (await locationSelect.isVisible()) {
      await locationSelect.selectOption({ label: 'Universitas Ciputra Surabaya' });
    }

    const searchInput = page.locator('input:not(#searchMenuItem):not([readonly])[type="text"], input:not(#searchMenuItem):not([readonly])[type="search"], input:not(#searchMenuItem):not([readonly])[placeholder*="search" i], input:not(#searchMenuItem):not([readonly])[placeholder*="title" i], input:not(#searchMenuItem):not([readonly])[placeholder*="judul" i]').filter({ visible: true }).first();
    await searchInput.fill('Olahraga');
    await page.getByRole('button', { name: /Search/i }).click({ force: true });

    await page.waitForTimeout(3000);

    const firstCheckbox = page.locator('input[type="checkbox"]').filter({ visible: true }).first();
    await firstCheckbox.check();

    const deleteBasketCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /Delete Previous Basket|delete.*basket/i });
    if (await deleteBasketCheckbox.isVisible()) {
      await deleteBasketCheckbox.check();
    }

    await page.getByRole('button', { name: /Add to Basket/i }).click({ force: true });

    await expect(page.locator('body')).toContainText(/berhasil|success|added|replaced/i);
  });

});
