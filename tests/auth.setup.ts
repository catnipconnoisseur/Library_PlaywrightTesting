import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  const username = (process.env.APP_USERNAME || '').trim();
  const password = (process.env.APP_PASSWORD || '').trim();
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]:has-text("Sign In")').click();

  try {
    await expect(page).toHaveURL(/.*home.*/i, { timeout: 30000 });
  } catch (err) {
    const errorAlert = page.locator('.alert, .text-danger, .invalid-feedback, [class*="error" i], [class*="danger" i]').first();
    if (await errorAlert.isVisible()) {
      const errorText = await errorAlert.textContent();
      throw new Error(`Login failed with error message: "${errorText?.trim()}" (URL was: ${page.url()})`);
    }
    throw new Error(`Login timed out waiting for redirection to /home. Current URL is: ${page.url()}. Body content: ${await page.locator('body').innerText()}`);
  }
  await expect(page).not.toHaveURL(/.*front\/authenticate.*/);

  await page.context().storageState({ path: authFile });
});
