// @ts-check
const { test, expect } = require('@playwright/test');
const utilities = require('./utilities');

test('Payment - Success', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('').selectOption('payment');

  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  await utilities.enterPin(page);

  await expect(page.locator('text=/PaymentRequest/')).toBeVisible();
  await expect(page.locator('text=/PaymentResponse/')).toBeVisible();
  await expect(page.locator('text=/"Success"/')).toBeVisible();
});