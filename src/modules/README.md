# modules

**Why this exists:** each portal feature lives in its own folder so it can be owned, reviewed and removed independently.

```text
modules/<name>/
  index.ts          public API (the only file others may import)
  <name>.config.ts  module settings (optional)
  pages/            page objects
  fixtures/         provides page objects to tests
  api/  data/       setup helpers and test data (optional)
  tests/            specs
```

**Current modules:** `auth` (login, logout, session setup), `patients` (Add Patient dialog).
`seed.spec.ts` is a seed test used by the Playwright planner/generator agents.

**Example: cross-module import**

```ts
import { LoginPage } from '@modules/auth';          // OK: public API
import { LoginPage } from '@modules/auth/pages/LoginPage'; // avoid: internal file
```

**Example: run one module**

```powershell
npx playwright test src/modules/patients
```

See the root README, "Adding a Module", for the step-by-step checklist.
