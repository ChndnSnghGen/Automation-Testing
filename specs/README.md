# Specs

This is a directory for test plans.

Plans are written by the Playwright planner agent (`.github/agents/playwright-test-planner.agent.md`),
then turned into tests by the generator agent using `src/modules/seed.spec.ts` as the starting setup.

**Example plan file:** `specs/add-patient.md`

```md
## Add Patient
### 1. Discard without saving
**Seed:** `src/modules/seed.spec.ts`
1. Click "Add Patient".
2. Fill first name, last name, date of birth.
3. Click Cancel, then "Exit Without Saving".
**Expected:** dialog closes; no patient is created.
```
