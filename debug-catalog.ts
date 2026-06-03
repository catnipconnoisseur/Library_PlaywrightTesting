import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('https://trial.uc.ac.id/home/login');
  await page.fill('#username', 'tchristabel@student.ciputra.ac.id');
  await page.fill('#password', 'TiffanyChrist05');
  await page.click('button[type="submit"], button:has-text("Log in")');
  await page.waitForNavigation();

  // Navigate to catalog
  await page.goto('https://trial.uc.ac.id/library_catalogl/home');
  await page.waitForTimeout(5000);

  // Take screenshot of initial catalog
  await page.screenshot({ path: 'test-results/debug-initial.png' });

  // Try to find the location dropdown
  try {
    const locationSelect = page.locator('select').first();
    const options = await locationSelect.locator('option').allTextContents();
    console.log('Location options:', options);
    
    // Select the first real option (not -All-)
    if (options.length > 1) {
      const val = await locationSelect.locator('option').nth(1).getAttribute('value');
      await locationSelect.selectOption(val, { force: true });
      console.log('Selected option:', val);
      await page.waitForTimeout(3000);
    }
  } catch(e) {
    console.log('Error selecting location:', e);
  }

  // Click Search
  await page.click('button:has-text("Search"), button:has-text("Cari")');
  await page.waitForTimeout(5000);

  // Take screenshot after search
  await page.screenshot({ path: 'test-results/debug-after-search.png' });
  
  const text = await page.locator('table').innerText();
  console.log('Table contents:', text.substring(0, 500));

  await browser.close();
})();
