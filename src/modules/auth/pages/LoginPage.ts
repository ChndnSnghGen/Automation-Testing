import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { UserMenu } from '@core/components/UserMenu';
import type { Credentials } from '../auth.config';

export class LoginPage extends BasePage {
  protected readonly path = '/';
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="Input.Email"]');
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  async login(credentials: Credentials): Promise<void> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async expectAuthenticated(expectedURL: string): Promise<void> {
    // The login POST can take over 5s on the dev server when browsers log in in parallel.
    await expect(this.page).toHaveURL(originAndPathPattern(expectedURL), { timeout: 15_000 });
    await expect(this.loginButton).toBeHidden();
    await new UserMenu(this.page).expectVisible();
  }
}

// Ignores trailing slash, query and fragment (e.g. returnUrl). A RegExp is used because a
// predicate makes toHaveURL wait for the page `load` event, which slow dashboards can miss.
function originAndPathPattern(url: string): RegExp {
  const { origin, pathname } = new URL(url);
  const base = `${origin}${pathname.replace(/\/+$/, '')}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${base}/?(?:[?#].*)?$`, 'i');
}