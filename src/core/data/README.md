# core/data

**Why this exists:** shared factories that build synthetic test data (for example random patient names, emails, dates).

**Put here when:** more than one module needs the same kind of data. Module-specific data goes in `src/modules/<module>/data/`.

**Rules**
- Synthetic data only. Never real patient or personal information.
- Factories return fresh values each call, with optional overrides: `buildPatient({ lastName: 'Smith' })`.
- Keep tests independent: do not rely on data created by another test.
- Must not import from any module.

**Example: a factory (`patient.factory.ts`)**

```ts
let counter = 0;
export function buildPatient(overrides: Partial<PatientDetails> = {}): PatientDetails {
  const n = ++counter;
  return {
    firstName: 'Autotest', lastName: `Patient${Date.now()}${n}`,
    dateOfBirth: '1990-01-15', email: `autotest.${Date.now()}.${n}@example.test`,
    ...overrides,
  };
}
```
