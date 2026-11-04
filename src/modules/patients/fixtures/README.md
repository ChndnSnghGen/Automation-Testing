# patients/fixtures

**Why this exists:** `patients.fixture.ts` hands a ready `PatientPage` to tests.

**Example** (the whole fixture)

```ts
export const test = base.extend<{ patientPage: PatientPage }>({
  patientPage: async ({ page }, use) => {
    await use(new PatientPage(page));
  },
});
```

Exported as `patientsTest` from `index.ts`, then merged in `src/fixtures.ts`:

```ts
export const test = mergeTests(authTest, patientsTest);
```

**Later:** when `api/` helpers exist, expose them here, e.g. a fixture that creates a
patient before the test and deletes it afterwards, so tests stay independent.
