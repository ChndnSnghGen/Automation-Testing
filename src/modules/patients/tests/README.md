# patients/tests

**Why this exists:** specs for patient features. Files here run in the logged-in projects (`chromium`, `firefox`, `webkit`), reusing the saved session.

**Current:** `add-patient.spec.ts`: fills the Add Patient form, asserts values (including the phone mask), then discards, so no data is created.

**Conventions**
- Import `test`/`expect` from `@fixtures`.
- Wrap phases in `test.step()` for readable reports.
- Synthetic data only; each test independent of the others.
- Pages that must be tested logged out go in a `guest/` subfolder.

**Example: a new test skeleton**

```ts
import { test, expect } from '@fixtures';

test('patient list shows the Add Patient button @smoke', async ({ patientPage }) => {
  await patientPage.goto();
  await expect(patientPage.addPatientButton).toBeVisible();
});
```

```powershell
npx playwright test src/modules/patients --project=chromium --headed
```
