// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Notification - Abort Request', async ({ request }) => {
  const response = await request.post('/sync', {
    data: fs.readFileSync(path.join(__dirname, '../../public/payloads/abortPayment/abortPaymentRequest.json'), 'utf-8'),
    headers: { 'Content-Type': 'application/json' }
  });

  await expect(response.status()).toBe(200);

  const json = await response.json();
  // abort request yield no body, see https://docs.adyen.com/api-explorer/terminal-api/1/post/abort#responses-200
  await expect(Object.keys(json)).toHaveLength(0);
});