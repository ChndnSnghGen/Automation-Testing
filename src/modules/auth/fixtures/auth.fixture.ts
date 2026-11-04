import { test as base } from '@playwright/test';
import { UserMenu } from '@core/components/UserMenu';
import { getLoginSettings, type LoginSettings } from '../auth.config';
import { LoginPage } from '../pages/LoginPage';

interface AuthFixtures {
  loginPage: LoginPage;
  loginSettings: LoginSettings;
  userMenu: UserMenu;
}

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  userMenu: async ({ page }, use) => {
    await use(new UserMenu(page));
  },
  loginSettings: async ({}, use) => {
    await use(getLoginSettings());
  },
});