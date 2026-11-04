# core/pages

**Why this exists:** `BasePage.ts` is the abstract parent of every page object. It guarantees each
page has a `path`, a shared `goto()`, and its own `expectLoaded()` readiness check.

**Put here when:** behaviour is common to *all* pages. Page-specific code belongs in
`src/modules/<module>/pages/`.

**Example: a new page object**

```ts
import { expect } from '@playwright/test';
import { BasePage } from '@core/pages/BasePage';
import { APP_STARTUP_TIMEOUT } from '@core/config/timeouts';

export class PatientListPage extends BasePage {
  protected readonly path = '/patients';

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Patients' }))
      .toBeVisible({ timeout: APP_STARTUP_TIMEOUT });
  }
}
```

**In a test:** `await patientListPage.goto();` navigates and waits until the page is ready,
so the next line can act immediately. Forgetting `expectLoaded()` is a compile error.
