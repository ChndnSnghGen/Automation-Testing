import { test, expect } from '@fixtures';

test.describe('Test group', () => {
  test('seed', async ({ patientPage }) => {
    // Leaves the browser logged in on a loaded page for the agents to continue from.
    await patientPage.goto();
    await expect(patientPage.addPatientButton).toBeVisible();
  });
});
