# auth

**Why this exists:** everything about signing in: the login page, session setup, logout and protected-route checks.

| Path | Purpose |
| --- | --- |
| `index.ts` | Public API: `authTest`, `LoginPage`, `getLoginSettings` |
| `auth.config.ts` | Reads `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_SUCCESS_URL` lazily |
| `pages/LoginPage.ts` | Login form locators and actions |
| `fixtures/auth.fixture.ts` | Provides `loginPage`, `userMenu`, `loginSettings` |
| `tests/` | `auth.setup.ts`, `guest/`, `contract/` |

**Example: the login flow in a test**

```ts
test('authorized user can log in @smoke', async ({ loginPage, loginSettings }) => {
  await loginPage.goto();
  await loginPage.login(loginSettings.credentials);
  await loginPage.expectAuthenticated(loginSettings.expectedURL);
});
```

**How logged-in tests get a session:** `tests/auth.setup.ts` logs in once and saves
`playwright/.auth/user.json`; the `chromium`/`firefox`/`webkit` projects reuse it, so
other modules' tests (like `patients`) start already logged in.

Use a dedicated non-production account. Failed repeated logins can lock it.
