// @ts-check
const { expect } = require('@playwright/test');

module.exports = {
    /**
     * Utility function to enter pin on the given page.
     */
    async enterPin(page) {
        await expect(page.locator('text=/Enter your pin/')).toBeVisible();
        await page.getByRole('button', { name: '1' }).click();
        await page.getByRole('button', { name: '2' }).click();
        await page.getByRole('button', { name: '3' }).click();
        await page.getByRole('button', { name: '4' }).click();
        await page.getByRole('button', { name: '✓' }).click();
        await expect(page.locator('text=/Enter your pin/')).toBeHidden();
    }
};