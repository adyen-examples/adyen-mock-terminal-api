// @ts-check
const { test, expect } = require('@playwright/test');
const utilities = require('../utilities');

test('Cancel Payment', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('').selectOption('payment');

  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  await utilities.pressCancel(page);

  await expect(page.locator('text=/PaymentRequest/')).toBeVisible();
  await expect(page.locator('text=/PaymentResponse/')).toBeVisible();
  await expect(page.locator('text=/"Cancel"/')).toBeVisible();
  await expect(page.locator('text=/102%20Shopper%20cancelled%20pin%20entry/')).toBeVisible();
});