# auth/fixtures

**Why this exists:** `auth.fixture.ts` creates the objects auth tests need, via Playwright's `test.extend()`, so tests just ask for them by name.

| Fixture | Value |
| --- | --- |
| `loginPage` | `new LoginPage(page)` |
| `userMenu` | shared header menu (logout) |
| `loginSettings` | credentials + success URL; read only when requested, so no-login suites need no secrets |

**Example: adding a fixture**

```ts
export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

**Example: using it**

```ts
test('logout', async ({ loginPage, loginSettings, userMenu }) => {
  await loginPage.goto();
  await loginPage.login(loginSettings.credentials);
  await userMenu.logout();
});
```

It is exported as `authTest` from `index.ts` and merged in `src/fixtures.ts`.
