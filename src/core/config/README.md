# core/config

**Why this exists:** one place for environment-dependent settings, so tests never hardcode URLs, secrets or timeouts.

| File | Purpose |
| --- | --- |
| `environments.ts` | Named environments and their base URLs (`dev` today) |
| `env.ts` | Resolves `TEST_ENV` / `BASE_URL`; exports `env`, `requiredEnv()`, `requiredUrlEnv()` |
| `timeouts.ts` | `APP_STARTUP_TIMEOUT` (60s) for the slow Blazor WebAssembly boot |

**Example: add a staging environment** (`environments.ts`)

```ts
export const environments = {
  dev: { baseURL: 'https://devportal.paydc.com/' },
  staging: { baseURL: 'https://staging.example.test/' },
} as const;
```

```powershell
$env:TEST_ENV = 'staging'; npx playwright test      # uses the staging URL
$env:BASE_URL = 'https://other.test/'; npx playwright test   # one-off override
```

**Example: read a secret safely**

```ts
const email = requiredEnv('LOGIN_EMAIL');   // throws "Missing LOGIN_EMAIL..." if unset
```

Never commit real values; they live in `.env` (git-ignored) or CI secrets.
