import { expect, test } from '@fixtures';

test('protected page redirects a logged-out user to the login form', async ({ page, loginPage }) => {
  await page.goto('/dashboard');

  await loginPage.expectLoaded();
  await expect(page).toHaveURL(/[?&]ReturnUrl=%2Fdashboard/i);
});

test('user can log out and is returned to the login form', async ({ page, loginPage, loginSettings, userMenu }) => {
  await loginPage.goto();
  await loginPage.login(loginSettings.credentials);
  await loginPage.expectAuthenticated(loginSettings.expectedURL);

  await userMenu.logout();

  await loginPage.expectLoaded();
  await page.goto('/dashboard');
  await loginPage.expectLoaded();
});
