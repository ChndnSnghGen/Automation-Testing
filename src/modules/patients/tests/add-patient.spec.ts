import { test, expect } from '@fixtures';
import type { PatientDetails } from '@modules/patients';

// Synthetic data only; this test cancels, so no patient record is created.
const patient: PatientDetails = {
  firstName: 'Autotest',
  middleName: 'Qa',
  lastName: 'Patient',
  dateOfBirth: '1990-01-15',
  email: 'autotest.patient@example.test',
  phone: '5551234567',
};

test('add patient form accepts details and can be discarded', async ({ patientPage }) => {
  await test.step('Open the Add Patient form', async () => {
    await patientPage.goto();
    await patientPage.clickAddPatient();
  });

  await test.step('Fill patient details', async () => {
    await patientPage.enterPatientDetails(patient);
    await patientPage.selectGender('Male');
    await patientPage.selectAccidentTypes(['Auto Accident (Occupant or Pedestrian)', 'Work Related Accident']);
  });

  await test.step('Verify the form holds the entered values', async () => {
    await expect(patientPage.firstNameInput).toHaveValue(patient.firstName);
    await expect(patientPage.middleNameInput).toHaveValue(patient.middleName ?? '');
    await expect(patientPage.lastNameInput).toHaveValue(patient.lastName);
    await expect(patientPage.dateOfBirthInput).toHaveValue(patient.dateOfBirth);
    await expect(patientPage.emailInput).toHaveValue(patient.email ?? '');
    await expect(patientPage.phoneInput).toHaveValue('(555) 123-4567');
    await expect(patientPage.genderSelect.locator('option:checked')).toHaveText('Male');
    await expect(patientPage.accidentTypeCheckboxes['Auto Accident (Occupant or Pedestrian)']).toBeChecked();
    await expect(patientPage.accidentTypeCheckboxes['Work Related Accident']).toBeChecked();
    await expect(patientPage.accidentTypeCheckboxes['Non Accident']).not.toBeChecked();
  });

  await test.step('Discard the form', async () => {
    await patientPage.cancelWithoutSaving();
  });
});
