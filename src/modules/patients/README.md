# patients

**Why this exists:** patient features. Today: the Add Patient dialog.

| Path | Purpose |
| --- | --- |
| `index.ts` | Public API: `patientsTest`, `PatientPage`, types |
| `pages/PatientPage.ts` | Dialog locators and form actions |
| `fixtures/patients.fixture.ts` | Provides `patientPage` |
| `tests/add-patient.spec.ts` | Fills the form, verifies values, discards |
| `api/`, `data/` | Reserved for setup helpers and test data |

Tests here start **logged in** (session from `auth.setup.ts`).

**Example**

```ts
import { test, expect } from '@fixtures';

test('add patient form accepts details and can be discarded', async ({ patientPage }) => {
  await patientPage.goto();
  await patientPage.clickAddPatient();
  await patientPage.enterPatientDetails({
    firstName: 'Autotest', lastName: 'Patient', dateOfBirth: '1990-01-15', phone: '5551234567',
  });
  await patientPage.selectGender('Male');
  await expect(patientPage.phoneInput).toHaveValue('(555) 123-4567');
  await patientPage.cancelWithoutSaving();   // saves nothing
});
```

```powershell
npx playwright test src/modules/patients
```

Synthetic data only; never real patient information.
