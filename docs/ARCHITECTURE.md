# PayDC Portal Automation: Architecture Summary

## Purpose
End-to-end UI test framework for the PayDC portal (a Blazor WebAssembly app), built on
Playwright and TypeScript. It is organised so each portal feature can be added, owned
and reviewed independently as the suite grows.

## Structure
```text
src/
  core/        Shared code used by all modules (config, BasePage, components, data, utils)
  modules/     One self-contained folder per portal feature (auth, patients, ...)
    <module>/  pages/ fixtures/ tests/ api/ data/ index.ts <module>.config.ts
  fixtures.ts  Merges every module's fixture into a single `test`
docs/          Longer documentation
scripts/       Non-test helper scripts
```

## Design principles
| Principle | How it is applied |
| --- | --- |
| Feature-based modules | Pages, fixtures, data and tests for a feature live together. Maps to CODEOWNERS; a module can be removed as one folder. |
| Clear boundaries | Other code imports a module only through its `index.ts`. `core/` never imports from a module, which prevents circular dependencies. |
| Page Object Model | Selectors and actions live in page classes extending `BasePage`; specs describe intent only. Role/label locators preferred. |
| Fixtures | Tests import one `test` from `@fixtures` and receive page objects ready to use. |
| Fast logged-in tests | Login runs once in a `setup` project; the saved session is reused. |
| Test types by folder | `tests/guest/` (logged out), `tests/contract/` (offline, mocked), `*.setup.ts`, plain `tests/*.spec.ts` (logged in). |

## Execution model
- Projects: `setup`, `guest-*` (chromium/firefox/webkit), logged-in `chromium/firefox/webkit`, and offline `contracts`.
- Login-submitting projects have `retries: 0` to avoid locking the shared account. Others retry twice on CI.
- Blazor startup takes roughly 25-35s per new context, so the first page check uses a 60s timeout and each test allows 120s.

## Security and data
- Credentials come from `.env` locally and from CI secrets/variables in the pipeline. `TEST_ENV` selects the target environment. `.env` is never committed.
- `playwright/.auth/user.json` holds live session cookies and is git-ignored.
- Traces, screenshots and videos are off by default (`PW_CAPTURE_ARTIFACTS=1` opts in, approved environments only).
- Synthetic data only; use a dedicated non-production test account.

## Quality gates
`npm run typecheck`, `npm run lint` (Playwright and no-floating-promises rules), then tests. CI runs the same in GitHub Actions.

## Current state
- Modules: `auth` (login, setup, contract test) and `patients` (add-patient form, discarded without saving).
- Placeholders ready but unused: `core/components`, `core/data`, `core/utils`, and `api/` and `data/` in each module. Each has a README stating when to use it.

## Adding a feature
1. Create `src/modules/<name>/` with page, fixture, `index.ts` and tests.
2. Register its fixture in `src/fixtures.ts`.
3. Run with `npx playwright test src/modules/<name>`.

## Decisions for review
1. Is feature-based (module) organisation the right ownership model for our teams?
2. Is one shared test account acceptable, or do we need one per worker or role?
3. Should API-based setup/cleanup (`api/`) be adopted to speed up tests and reduce UI dependence?
4. Which environments (dev only, or also staging) should CI target?
