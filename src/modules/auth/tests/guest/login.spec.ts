import { test } from '@fixtures';

test('authorized user can log in with valid credentials @smoke', async ({ loginPage, loginSettings }) => {
  await test.step('Open the login form', async () => {
    await loginPage.goto();
  });

  await test.step('Submit valid credentials', async () => {
    await loginPage.login(loginSettings.credentials);
  });

  await test.step('Verify the authenticated destination', async () => {
    await loginPage.expectAuthenticated(loginSettings.expectedURL);
  });
});