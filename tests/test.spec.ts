import { test, expect } from '@playwright/test';

test('My Test', async ({ page }) => {
    // Test code goes here
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
});