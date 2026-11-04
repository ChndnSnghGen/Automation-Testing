# patients/data

**Why this exists:** test data specific to the patients module (for example valid and invalid patient form values).

**Put here when:** the data only makes sense for patients. Data useful to several modules goes in `src/core/data/`.

**Rules**
- Synthetic data only. Never real patient information.
- Prefer factory functions over fixed constants so tests do not collide.

**Example (illustrative):**

```ts
export const invalidDobs = ['', '2999-01-01', 'abc'];   // for negative form tests
export const withAccident = (p: PatientDetails) => ({ ...p, accidents: ['Non Accident'] as const });
```
