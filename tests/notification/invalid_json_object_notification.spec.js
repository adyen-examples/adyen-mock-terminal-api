// @ts-check
const { test, expect } = require('@playwright/test');

test('Notification - Invalid JsonObject', async ({ request }) => {
  const response = await request.post('/sync', {
    data: 'invalid-data',
    headers: { 'Content-Type': 'application/json' }
  });

  await expect(response.status()).toBe(200);

  const json = await response.json();
  await expect(json.SaleToPOIRequest.MessageHeader).toHaveProperty('MessageClass', 'Event');
  await expect(json.SaleToPOIRequest.MessageHeader).toHaveProperty('MessageType', 'Notification');
  await expect(json.SaleToPOIRequest.EventNotification).toHaveProperty('EventToNotify', 'Reject');
  await expect(json.SaleToPOIRequest.EventNotification).toHaveProperty('EventDetails', 'message=Input+is+not+a+JSONObject');
});