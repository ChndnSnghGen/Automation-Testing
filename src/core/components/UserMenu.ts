import { expect, type Locator, type Page } from '@playwright/test';
import { APP_STARTUP_TIMEOUT } from '@core/config/timeouts';

// App-shell header menu, present on every logged-in page.
export class UserMenu {
  readonly trigger: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.trigger = page.getByRole('button', { name: 'user-img' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async expectVisible(): Promise<void> {
    await expect(this.trigger).toBeVisible({ timeout: APP_STARTUP_TIMEOUT });
  }

  async logout(): Promise<void> {
    await this.trigger.click();
    await this.logoutButton.click();
  }
}
