# src

**Why this exists:** all framework and test code. Nothing outside `src/` contains test logic.

| Path | Purpose |
| --- | --- |
| `core/` | Shared, module-agnostic framework code (config, base page, components) |
| `modules/` | One self-contained folder per portal feature (auth, patients, ...) |
| `fixtures.ts` | Merges every module's fixture into the single `test` that specs import |

**Dependency direction:** `modules -> core`, never the other way. Modules talk to each
other only through `@modules/<name>` (its `index.ts`).

**Example: the import every spec starts with**

```ts
import { test, expect } from '@fixtures';   // gives loginPage, patientPage, userMenu, ...
```

**Example: adding a new module's fixture** (`fixtures.ts`)

```ts
export const test = mergeTests(authTest, patientsTest /*, billingTest */);
```
