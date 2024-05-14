// @ts-check
const { test, expect } = require('@playwright/test');
const utilities = require('./utilities');

test('128 Payment - Invalid Card', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('').selectOption('128_paymentInvalidCard');

  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  await utilities.enterPin(page);

  await expect(page.locator('text=/PaymentRequest/')).toBeVisible();
  await expect(page.locator('text=/PaymentResponse/')).toBeVisible();
  await expect(page.locator('text=/"InvalidCard"/')).toBeVisible();
});