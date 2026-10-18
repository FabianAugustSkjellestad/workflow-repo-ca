import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login/index.html');
    });

    test('user can log in with valid credentials', async ({ page }) => {
        expect(process.env.TEST_USER_EMAIL, 'TEST_USER_EMAIL missing').toBeTruthy();
        expect(process.env.TEST_USER_PASSWORD, 'TEST_USER_PASSWORD missing').toBeTruthy();

        await page.locator('#loginForm input[name="email"]').fill(process.env.TEST_USER_EMAIL);
        await page.locator('#loginForm input[name="password"]').fill(process.env.TEST_USER_PASSWORD);
    
        // Wait for the login API response AND the redirect together
        const [response] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/auth/login')),
            page.getByRole('button', { name: 'Login' }).click(),
        ]);

        console.log('Login response status:', response.status());
        if (!response.status() !== 200) {
            console.log('Login response body:', await response.text());
        }
        expect(response.status()).toBe(200);

       
        // Then wait for the redirect away from /login/
        await page.waitForURL(url => !url.pathname.includes('/login/')); 

        // Survives navigations/reloads
        await page.waitForFunction(
            () => localStorage.getItem('token') !== null && localStorage.getItem('user') !== null,
            { timeout: 10000 } 
    );

    
        // Token is stored as a JSON-stringified string
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token')));
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
    
        const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user')));
        expect(user).toBeTruthy();
        expect(user.email).toBe(process.env.TEST_USER_EMAIL);
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
        await expect(page).toHaveURL(/\/login\/index\.html$/);
    });
});
