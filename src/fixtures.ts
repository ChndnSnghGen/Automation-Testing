import { mergeTests } from '@playwright/test';
import { authTest } from '@modules/auth';
import { patientsTest } from '@modules/patients';

// Register each module's fixture here.
export const test = mergeTests(authTest, patientsTest);
export { expect } from '@playwright/test';
