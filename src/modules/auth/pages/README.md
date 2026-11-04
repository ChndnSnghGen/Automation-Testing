# auth/pages

**Why this exists:** page objects for authentication. They own selectors and actions so specs read as user steps.

**Current:** `LoginPage.ts` with `goto()`, `login(credentials)` and `expectAuthenticated(url)`.

**Example: locators and an action** (from `LoginPage.ts`)

```ts
this.emailInput = page.locator('input[name="Input.Email"]');
this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
this.loginButton = page.getByRole('button', { name: 'Login', exact: true });

async login({ email, password }: Credentials) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```

**Rules**
- Extend `BasePage`; set `path`; implement `expectLoaded()`.
- Prefer `getByRole` / `getByLabel`; avoid CSS and positional selectors.
- Success is asserted with `expectAuthenticated()` (URL + Login button gone + user menu visible), not just a click.
