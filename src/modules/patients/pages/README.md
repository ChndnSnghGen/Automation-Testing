# patients/pages

**Why this exists:** page objects for patient screens. `PatientPage.ts` models the Add Patient dialog.

**Example: typed input and a reusable action**

```ts
export interface PatientDetails {
  firstName: string; lastName: string;
  dateOfBirth: string;   // ISO YYYY-MM-DD for the native date input
  phone?: string;        // digits only; the field applies its own mask
}

async enterPatientDetails(d: PatientDetails) {
  await this.firstNameInput.fill(d.firstName);
  await this.lastNameInput.fill(d.lastName);
  await this.dateOfBirthInput.fill(d.dateOfBirth);
  if (d.phone !== undefined) await this.phoneInput.fill(d.phone);
}
```

**Example: scoping locators to the dialog**

```ts
const dialog = page.getByRole('dialog', { name: 'Add Patient' });
this.saveButton = dialog.getByRole('button', { name: 'Save', exact: true });
```

**Known weakness:** last name and phone use `.nth()` because the fields lack ids/labels.
Ask the app team for `label[for]`, then switch to `getByLabel()`.

To add a page, extend `BasePage`, set `path`, implement `expectLoaded()`.
