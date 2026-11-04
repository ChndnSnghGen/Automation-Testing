import { test as setup } from '@fixtures';
import { env } from '@core/config/env';

setup('authenticate shared user', async ({ page, loginPage, loginSettings }) => {
  await loginPage.goto();
  await loginPage.login(loginSettings.credentials);
  await loginPage.expectAuthenticated(loginSettings.expectedURL);
  await page.context().storageState({ path: env.authStateFile });
});
