# PayDC Portal Automation

## Recording Review

The recorded script fills a form and clicks Login, but a successful click does not
prove authentication succeeded. It also embeds a password, duplicates selectors,
hardcodes an environment, and uses an uninformative test name. Clicking inputs
before `fill()` is unnecessary: Playwright waits for actionability automatically.
Rotate the password shared in the recording; never commit it or use production accounts.

## Folder Structure

Each portal module is one self-contained folder: its pages, fixtures, settings and
tests live together. Shared, module-agnostic code lives in `src/core/`.

```text
src/
  core/                         Shared framework; must not import from any module
    config/env.ts               Base URL, artifact flags, session path, requiredEnv()
    config/environments.ts      Named environments selected by TEST_ENV
    config/timeouts.ts          Shared timeouts (APP_STARTUP_TIMEOUT for Blazor startup)
    pages/BasePage.ts            Common page contract: path, goto(), expectLoaded()
    components/                 Shared UI widgets (UserMenu: header menu with logout; nav, table, modal to come)
    data/                       Shared synthetic test-data factories
    utils/                      Small generic helpers
  modules/
    auth/                       One folder per portal module
      index.ts                  Public API: the only file other code may import
      auth.config.ts            Module-specific settings (credentials, success URL)
      pages/LoginPage.ts        Page objects: selectors and actions
      fixtures/auth.fixture.ts  Provides the module's page objects to tests
      api/                      API helpers for setup/cleanup (not yet used)
      data/                     Module-specific test data (not yet used)
      tests/
        auth.setup.ts                 Logs in once and saves the shared session
        guest/login.spec.ts           Live test that starts logged out
        guest/access.spec.ts          Protected-route redirect and logout
        contract/login.spec.ts        Offline test against a mocked page
    patients/
      index.ts
      pages/PatientPage.ts      Add Patient dialog: locators and form actions
      api/                      API helpers for setup/cleanup (not yet used)
      data/                     Module-specific test data (not yet used)
      fixtures/patients.fixture.ts
      tests/add-patient.spec.ts Fills the form, verifies values, discards (saves nothing)
  modules/seed.spec.ts          Seed test used by the Playwright planner/generator agents
  fixtures.ts                   Merges every module's fixture into one `test`
docs/                           Longer documentation (architecture, CI, troubleshooting)
scripts/                        Non-test helper scripts (cleanup, env checks)
specs/                          Test plans produced by the planner agent
playwright/.auth/               Generated session state (git-ignored, sensitive)
.github/workflows/              playwright.yml (CI), copilot-setup-steps.yml
.github/agents/                 Playwright planner / generator / healer agents
.env, .env.example              Local settings (only `.env.example` is committed)
playwright.config.ts            Projects, timeouts, retries, reporters
```

## Real-Time Example: Add Patient Flow

How one real test (`src/modules/patients/tests/add-patient.spec.ts`) flows through
the layers. Run it with `npx playwright test src/modules/patients`.

```text
add-patient.spec.ts  ->  @fixtures (test)  ->  patientsTest fixture  ->  PatientPage  ->  BasePage
   test intent           one merged test       builds page objects      locators+actions   goto()
```

1. **Base class** (`src/core/pages/BasePage.ts`): every page has a `path`, a shared
   `goto()` that navigates and then calls the page's own `expectLoaded()`.

   ```ts
   export abstract class BasePage {
     protected abstract readonly path: string;
     constructor(protected readonly page: Page) {}
     async goto() { await this.page.goto(this.path); await this.expectLoaded(); }
     abstract expectLoaded(): Promise<void>;
   }
   ```

2. **Page object** (`modules/patients/pages/PatientPage.ts`): owns selectors and actions.

   ```ts
   export class PatientPage extends BasePage {
     protected readonly path = '/dashboard';
     readonly addPatientButton = this.page.getByRole('button', { name: 'Add Patient' });
     async expectLoaded() {
       await expect(this.addPatientButton).toBeVisible({ timeout: APP_STARTUP_TIMEOUT });
     }
     async clickAddPatient() { /* click, then wait for the dialog */ }
     async enterPatientDetails(details: PatientDetails) { /* fill() each field */ }
   }
   ```

3. **Fixture** (`modules/patients/fixtures/patients.fixture.ts`) hands the page object to tests:

   ```ts
   export const test = base.extend<{ patientPage: PatientPage }>({
     patientPage: async ({ page }, use) => { await use(new PatientPage(page)); },
   });
   ```

4. **Registration** (`src/fixtures.ts`): `mergeTests(authTest, patientsTest)`.

5. **Test** (`add-patient.spec.ts`): reads like the user's steps; synthetic data only.

   ```ts
   import { test, expect } from '@fixtures';

   test('add patient form accepts details and can be discarded', async ({ patientPage }) => {
     await test.step('Open the Add Patient form', async () => {
       await patientPage.goto();            // BasePage.goto() -> expectLoaded()
       await patientPage.clickAddPatient();
     });
     await test.step('Fill patient details', async () => {
       await patientPage.enterPatientDetails({
         firstName: 'Autotest', lastName: 'Patient',
         dateOfBirth: '1990-01-15', phone: '5551234567',
       });
       await patientPage.selectGender('Male');
     });
     await test.step('Verify and discard', async () => {
       await expect(patientPage.phoneInput).toHaveValue('(555) 123-4567'); // mask applied
       await patientPage.cancelWithoutSaving();                           // nothing saved
     });
   });
   ```

   Runtime sequence: `setup` logs in once and saves `playwright/.auth/user.json` ->
   the `chromium` project reuses it -> the test opens `/dashboard`, waits for the
   Blazor app (~25-35s), fills the form, asserts, and cancels without creating data.

| Item | Why it is needed |
| --- | --- |
| `src/modules/<module>/` | A module can be added, owned, reviewed or removed as one folder; teams don't edit each other's files. Maps cleanly to CODEOWNERS. |
| `index.ts` per module | Defines the module boundary. Other modules import `@modules/auth`, never its internal files, so internals can change safely. |
| `<module>.config.ts` | Each module reads only its own settings; suites that don't need them run without secrets. |
| `src/core/` | Code every module needs. Keeping it module-free avoids circular dependencies. |
| `src/fixtures.ts` | Tests import one `test` from `@fixtures` and get every module's page objects. |
| Test-type folders | `tests/guest/` (logged out), `tests/contract/` (offline), `*.setup.ts`, and `tests/*.spec.ts` (logged in) select the project. |
| Path aliases | `@core/*`, `@modules/*`, `@fixtures` avoid fragile `../../..` imports. |

## Projects

| Project | Files | Notes |
| --- | --- | --- |
| `setup` | `*.setup.ts` | Runs before the logged-in projects. Needs login settings. Never retried. |
| `guest-chromium`, `guest-firefox`, `guest-webkit` | `tests/guest/**/*.spec.ts` | Start logged out; independent of `setup`. Never retried. |
| `chromium`, `firefox`, `webkit` | other `*.spec.ts` | Start logged in using `playwright/.auth/user.json`. |
| `contracts` | `tests/contract/**/*.spec.ts` | Chromium only, offline. |

Projects that submit the login form have `retries: 0`: retrying a rejected login can
lock the shared account. This also applies to other guest tests. Other projects still
retry twice on CI.

## Adding a Module

Example: the existing `patients` module follows these steps.

1. Create `src/modules/patients/pages/PatientListPage.ts` extending `BasePage`; set
   `path` and implement `expectLoaded()` with a stable, page-specific locator.
2. Create `src/modules/patients/fixtures/patients.fixture.ts` exposing the page objects.
3. Create `src/modules/patients/index.ts` exporting `patientsTest` and the pages.
4. Register it in `src/fixtures.ts`: `mergeTests(authTest, patientsTest)`.
5. Add `src/modules/patients/tests/patient-list.spec.ts` importing `test` from
   `@fixtures`. It starts logged in. Tag critical paths `@smoke`.
6. Put tests for pages that must be tested logged out in `tests/guest/`.
7. If the module needs its own settings, add `patients.config.ts` using `requiredEnv()`.

Run one module with `npx playwright test src/modules/patients`.
Record selectors with `npx playwright codegen` and move them into the page object;
prefer `getByRole`/`getByLabel` over CSS. When a second module needs a shared widget
such as the navigation menu, put it in `src/core/components/`.

## Setup

Use a supported Node.js LTS release (Node.js 22 or newer) and an authorized,
dedicated test account in a non-production environment.

```powershell
npm ci
npx playwright install
Copy-Item .env.example .env
```

Edit the local `.env` file and supply `LOGIN_EMAIL`, `LOGIN_PASSWORD`, and
`LOGIN_SUCCESS_URL`: the absolute URL observed after a successful manual login.
Only its origin and path are compared (case-insensitively, ignoring a trailing slash),
so changing query strings such as `returnUrl` or `#fragments` do not cause failures.
The check uses a regular expression because a predicate function would also wait for
the page `load` event, which a slow dashboard may not reach in time. The redirect wait
is 15 seconds because the dev server can exceed 5 seconds with parallel logins.
For the dev portal this is `https://devportal.paydc.com/dashboard`.
`TEST_ENV` selects the environment from `src/core/config/environments.ts` (default `dev`;
an unknown name fails fast). `BASE_URL` optionally overrides its URL. CI environment variables override
values in `.env`; CI should inject secrets directly rather than create a committed file.

The current success contract is the configured destination URL plus the absence
of the Login button. Confirm that this URL is protected by authentication before
relying on it. If the application has a stable authenticated-only heading or user
menu, add an assertion for that element in `LoginPage.expectAuthenticated()` after
inspecting the real page. A URL alone is not proof of authorization.

## Run

```powershell
npm run typecheck
npm run lint
npm run test:contracts
npm run test:smoke
npm run test:login -- --project=guest-chromium
npm run test:e2e
npm run test:headed
npm run report
```

`test:login` runs only the login test file, in the `guest-*` projects, and does not need
`setup`. Add `-- --project=guest-chromium` (and `--headed` to watch) for one browser.
Browser projects depend on `setup`, so it runs automatically first. Each test gets
a fresh browser context, but all share one server-side account session.
If the portal invalidates concurrent sessions, use one account per worker or
reduce workers. For Linux CI, install browser dependencies with `npx playwright install --with-deps`.
The CI workflow type-checks and lints, then runs all projects. Configure repository secrets
`LOGIN_EMAIL` and `LOGIN_PASSWORD`, and variables `BASE_URL` and `LOGIN_SUCCESS_URL`.
Secrets are not available to pull requests from forks, so those runs fail at `setup`.

## Design and Security

- The portal is a Blazor WebAssembly app: every new browser context (every test) waits
  about 25-35 seconds before page content renders. Each page's first `expectLoaded()`
  check uses `APP_STARTUP_TIMEOUT` (60s) from `src/core/config/timeouts.ts`, and the
  per-test timeout is 120s. Budget roughly 35s per logged-in test.
- Prefer role and label locators. Password and Login use exact accessible names;
  email retains the recorded stable `name` attribute because its accessible label
  has not been verified. Replace it with `getByLabel()` only after inspecting the form.
- Use `fill()`, actionability checks, and web-first `expect()` assertions; no fixed
  sleeps, forced clicks, or `networkidle` waits are needed.
- `npm run lint` uses `eslint-plugin-playwright` and type-aware
  `@typescript-eslint/no-floating-promises`, which reports a missing `await` as an error.
  Page-object methods named `expect*` count as assertions for `playwright/expect-expect`.
- TypeScript is pinned to `~6.0` because `typescript-eslint` does not yet support
  TypeScript 7. Upgrade both together once it does.
- Keep actions separate from test intent and do not swallow assertion failures.
  Tests must not depend on execution order or on data created by other tests.
- No real credentials are passed in test names, step labels, URLs, or logs. However,
  failure reports can still include page content. Handle all reports as sensitive.
- Traces, screenshots, and videos are off by default. Set `PW_CAPTURE_ARTIFACTS=1`
  only in an approved test environment to retain failure traces and screenshots.
  Traces can expose form values, network traffic, session tokens, or patient data;
  restrict access, apply retention limits, and do not upload them to public services.
- Use synthetic data. Never commit `.env`, storage state, or reports. Ignoring files
  does not remove secrets that were already committed. `playwright/.auth/user.json`
  holds live session cookies; treat it like a password.
- Negative-login, lockout, MFA, and session-expiry cases need confirmed application
  behavior and dedicated data. They are intentionally not invented from this recording.
- Tests that need different roles should use separate setup files and storage-state
  files per role rather than switching users inside a test.