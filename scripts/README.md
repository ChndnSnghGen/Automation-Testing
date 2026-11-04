# scripts

**Why this exists:** helper scripts that are not tests (environment checks, cleanup of test data, report publishing).

**Put here when:** a task is run manually or from CI, outside `playwright test`. Add an `npm run` entry in `package.json` for each script.

**Rules**
- Never hardcode secrets; read them from environment variables.
- Example: `scripts/check-env.js` verifies `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_SUCCESS_URL` are set; add `"check:env": "node scripts/check-env.js"` to `package.json` and run `npm run check:env`.
- Document what each script does and when to run it, at the top of the file.
