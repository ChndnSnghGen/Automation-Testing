# auth/api

**Why this exists:** API helpers for authentication, for example logging in by API to speed up setup or checking session state.

**Put here when:** the login flow needs to be driven without the UI. The UI login itself stays covered by `tests/guest/login.spec.ts`.

**Rules**
- Use Playwright's `request` fixture / `APIRequestContext`.
- Credentials come from `auth.config.ts` / environment variables, never hardcoded.
- Never log tokens or cookies.

**Example (illustrative; endpoint must be confirmed with the app team)**

```ts
export async function apiLogin(request: APIRequestContext, { email, password }: Credentials) {
  const res = await request.post('/api/login', { data: { email, password } });
  expect(res.ok()).toBeTruthy();
  await request.storageState({ path: env.authStateFile });
}
```
