import { test as base } from '@playwright/test';
import { PatientPage } from '../pages/PatientPage';

interface PatientsFixtures {
  patientPage: PatientPage;
}

export const test = base.extend<PatientsFixtures>({
  patientPage: async ({ page }, use) => {
    await use(new PatientPage(page));
  },
});
