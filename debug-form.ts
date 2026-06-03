import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('https://trial.uc.ac.id/home/login');
  await page.fill('#username', 'tchristabel@student.ciputra.ac.id');
  await page.fill('#password', 'TiffanyChrist05');
  await page.click('button[type="submit"], button:has-text("Log in")');
  await page.waitForNavigation({ timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  // Navigate to catalog
  await page.goto('https://trial.uc.ac.id/library_catalogl/home');
  await page.waitForTimeout(5000);

  // Dump HTML
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('test-results/catalog-body.html', html);
  
  await browser.close();
})();
