import { expect, type Locator, type Page } from '@playwright/test';
import { APP_STARTUP_TIMEOUT } from '@core/config/timeouts';
import { BasePage } from '@core/pages/BasePage';

export type Gender = 'Male' | 'Female' | 'Not Specified' | 'Declines to Specify' | 'Other';

export type AccidentType =
  | 'Auto Accident (Occupant or Pedestrian)'
  | "Accident in Someone Else's Home"
  | 'Other Accident'
  | 'Work Related Accident'
  | "Accident on Premises of Someone Else's Business"
  | 'Non Accident';

export interface PatientDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  /** ISO format `YYYY-MM-DD`, as required by the native date input. */
  dateOfBirth: string;
  email?: string;
  /** Digits only; the field applies its own `(___) ___-____` mask. */
  phone?: string;
}

const ACCIDENT_TYPES: readonly AccidentType[] = [
  'Auto Accident (Occupant or Pedestrian)',
  "Accident in Someone Else's Home",
  'Other Accident',
  'Work Related Accident',
  "Accident on Premises of Someone Else's Business",
  'Non Accident',
];

export class PatientPage extends BasePage {
  protected readonly path = '/dashboard';

  readonly addPatientButton: Locator;
  readonly addPatientDialog: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly genderSelect: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly accidentTypeCheckboxes: Readonly<Record<AccidentType, Locator>>;
  readonly accidentTypeToggles: Readonly<Record<AccidentType, Locator>>;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly exitWithoutSavingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addPatientButton = page.getByRole('button', { name: 'Add Patient' });
    this.addPatientDialog = page.getByRole('dialog', { name: 'Add Patient' });

    const dialog = this.addPatientDialog;
    this.firstNameInput = dialog.locator('#firstName');
    this.middleNameInput = dialog.locator('#middleName');
    this.dateOfBirthInput = dialog.locator('#dateofbirth');
    this.emailInput = dialog.getByRole('textbox', { name: 'Email Address' });
    // These fields have no id or associated <label>, so position within the dialog is the only hook.
    // Ask the app team to add ids or label[for] so these can become getByLabel().
    this.lastNameInput = dialog.getByRole('textbox').nth(2);
    this.phoneInput = dialog.getByRole('textbox').nth(5);
    this.genderSelect = dialog.getByRole('combobox').first();

    this.accidentTypeCheckboxes = Object.fromEntries(
      ACCIDENT_TYPES.map((type) => [type, dialog.getByRole('checkbox', { name: type, exact: true })]),
    ) as Record<AccidentType, Locator>;
    // A styled <span class="checkmark"> overlays each input and its wrapper label, so it is the clickable element.
    this.accidentTypeToggles = Object.fromEntries(
      ACCIDENT_TYPES.map((type) => [
        type,
        dialog
          .locator('label.checkbox-container')
          .filter({ has: page.getByRole('checkbox', { name: type, exact: true }) })
          .locator('.checkmark'),
      ]),
    ) as Record<AccidentType, Locator>;

    this.saveButton = dialog.getByRole('button', { name: 'Save', exact: true });
    this.cancelButton = dialog.getByRole('button', { name: 'Cancel', exact: true });
    this.exitWithoutSavingButton = page.getByRole('button', { name: 'Exit Without Saving' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.addPatientButton).toBeVisible({ timeout: APP_STARTUP_TIMEOUT });
  }

  async clickAddPatient(): Promise<void> {
    await this.addPatientButton.click();
    await expect(this.addPatientDialog).toBeVisible();
  }

  async enterPatientDetails(details: PatientDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    if (details.middleName !== undefined) await this.middleNameInput.fill(details.middleName);
    await this.lastNameInput.fill(details.lastName);
    await this.dateOfBirthInput.fill(details.dateOfBirth);
    if (details.email !== undefined) await this.emailInput.fill(details.email);
    if (details.phone !== undefined) await this.phoneInput.fill(details.phone);
  }

  async selectGender(gender: Gender): Promise<void> {
    await this.genderSelect.selectOption(gender);
  }

  async selectAccidentTypes(types: readonly AccidentType[]): Promise<void> {
    for (const type of types) {
      if (!(await this.accidentTypeCheckboxes[type].isChecked())) {
        await this.accidentTypeToggles[type].click();
      }
      await expect(this.accidentTypeCheckboxes[type]).toBeChecked();
    }
  }

  async savePatient(): Promise<void> {
    await this.saveButton.click();
  }

  async cancelWithoutSaving(): Promise<void> {
    await this.cancelButton.click();
    await this.exitWithoutSavingButton.click();
    await expect(this.addPatientDialog).toBeHidden();
  }
}
