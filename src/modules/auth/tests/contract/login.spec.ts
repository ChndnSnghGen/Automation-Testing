import { test, expect } from '@playwright/test';
import { LoginPage, type Credentials } from '@modules/auth';

test.use({ baseURL: 'https://login.example.test' });

test('LoginPage submits credentials and recognizes the configured destination', async ({ page }) => {
  const credentials: Credentials = {
    email: 'qa@example.test',
    password: 'local-test-only',
  };
  let submittedForm: URLSearchParams | undefined;

  await page.route('https://login.example.test/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;

    if (pathname === '/dashboard' && request.method() === 'POST') {
      submittedForm = new URLSearchParams(request.postData() ?? '');
    }

    await route.fulfill({
      contentType: 'text/html',
      body: pathname === '/dashboard'
        ? '<h1>Account dashboard</h1>'
        : `<form action="/dashboard?returnUrl=%2Fhome#overview" method="post">
            <label>Email <input name="Input.Email" type="email" required></label>
            <label>Password <input name="Input.Password" type="password" required></label>
            <button type="submit">Login</button>
          </form>`,
    });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials);
  await loginPage.expectAuthenticated('https://login.example.test/dashboard');

  expect(submittedForm?.get('Input.Email')).toBe(credentials.email);
  expect(submittedForm?.get('Input.Password')).toBe(credentials.password);
  await expect(page.getByRole('heading', { name: 'Account dashboard' })).toBeVisible();
});