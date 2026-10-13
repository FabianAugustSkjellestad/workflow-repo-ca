import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login/index.html');
    });

    test('user can log in with valid credentials', async ({ page }) => {
        await page.locator('#loginForm input[name="email"]').fill(process.env.TEST_USER_EMAIL);
        await page.locator('#loginForm input[name="password"]').fill(process.env.TEST_USER_PASSWORD);

        await page.getByRole('button', { name: 'Login' }).click();

        // Redirects to "/" after successful login
        await expect(page).toHaveURL(/\/$/);

        // Token is saved as JSON-stringified string -> Parse before asserting
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token')));
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');

        // User object is also saved
        const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user')));
        expect(user).toBeTruthy();
    });

    test('shows API error message on invalid credentials', async ({ page }) => {
        await page.locator('#loginForm input[name="email"]').fill('wrong@stud.noroff.no');
        await page.locator('#loginForm input[name="password"]').fill('wrongpassword');

        await page.getByRole('button', { name: 'Login' }).click();

        // Expect an error message to be displayed
        const messageContainer = page.locator('#message-container');
        await expect(messageContainer).toContainText(/Invalid|Wrong|Incorrect|unauthorized|login failed/i);

        // Fieldset re-enabled
        await expect(page.locator('#loginForm fieldset')).toBeEnabled();

        // Nothing stored
        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeNull();
    });

    test('shows client-side validation errors for empty fields', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();

        const messageContainer = page.locator('#message-container');
        await expect(messageContainer.locator('p.text-red-500').first()).toBeVisible();

        // Should NOT have navigated
        await expect(page).toHaveURL(/\/login\/index.html/);
    });
});