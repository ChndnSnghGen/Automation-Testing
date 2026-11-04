# auth/tests

**Why this exists:** auth specs, split by folder because the folder decides which Playwright project runs them.

| Path | Project | Starts as | Example |
| --- | --- | --- | --- |
| `auth.setup.ts` | `setup` | logged out | logs in once, saves `playwright/.auth/user.json` |
| `guest/*.spec.ts` | `guest-*` | logged out, no retries | `login.spec.ts`, `access.spec.ts` |
| `contract/*.spec.ts` | `contracts` | offline (mocked page) | `login.spec.ts` |

**Example: a guest test** (`guest/access.spec.ts`)

```ts
test('protected page redirects a logged-out user to the login form', async ({ page, loginPage }) => {
  await page.goto('/dashboard');
  await loginPage.expectLoaded();
  await expect(page).toHaveURL(/[?&]ReturnUrl=%2Fdashboard/i);
});
```

**Run**

```powershell
npm run test:login -- --project=guest-chromium
npm run test:contracts
```

Guest tests never retry: repeating a rejected login can lock the shared account.
Tag critical paths `@smoke`.
