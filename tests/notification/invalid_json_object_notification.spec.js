// @ts-check
const { test, expect } = require('@playwright/test');

test('Notification - Invalid JsonObject', async ({ page }) => {
  const response = await request.post(`/sync`, {
    data: {
      body: 'invalid-json',
    }
  });
  await expect(response.ok()).toBeTruthy();
  
  const json = await response.json();
  await expect(json).toHaveProperty('MessageClass', 'Event');
  await expect(json).toHaveProperty('MessageType', 'Notification');
  await expect(json).toHaveProperty('EventToNotify', 'Reject');
  await expect(json).toHaveProperty('EventDetails', 'message=Input+is+not+a+JSONObject');
});

test('Notification - Invalid JsonObject', async ({ page }) => {
  const response = await request.post(`/sync`, {
    data: {
      body: 'invalid-json',
    }
  });
  await expect(response.ok()).toBeTruthy();

  const json = await response.json();
  await expect(json).toHaveProperty('MessageClass', 'Event');
  await expect(json).toHaveProperty('MessageType', 'Notification');
  await expect(json).toHaveProperty('EventToNotify', 'Reject');
  await expect(json).toHaveProperty('EventDetails', 'message=Input+is+not+a+JSONObject');
});