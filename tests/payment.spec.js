// @ts-check
const { test, expect } = require('@playwright/test');

test('Mock Terminal Test', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('').selectOption('payment');

  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.locator('text=/Enter your pin/')).toBeVisible();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '4' }).click();
  await page.getByRole('button', { name: '✓' }).click();
  await expect(page.locator('text=/Enter your pin/')).toBeHidden();

  await expect(page.locator('text=/PaymentRequest/')).toBeVisible();
  await expect(page.locator('text=/PaymentResponse/')).toBeVisible();
});