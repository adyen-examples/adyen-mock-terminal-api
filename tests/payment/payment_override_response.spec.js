// @ts-check
const { test, expect } = require('@playwright/test');
const utilities = require('../utilities');

test('Payment - Override response', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('', { exact: true }).selectOption('payment');

  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  await page.getByLabel('Returned response on PIN enter').selectOption('134_paymentWrongPin');

  await utilities.enterPin(page);

  await expect(page.locator('text=/PaymentResponse/')).toBeVisible();
  await expect(page.locator('text=/"WrongPIN"/')).toBeVisible();
  await expect(page.locator('text=/INVALID_PIN/')).toBeVisible();
});