# core/components

**Why this exists:** reusable UI widgets that appear on many pages (navigation menu, data table, modal, date picker).

**Put here when:** a second module needs the same widget. Until then, keep it inside the module's `pages/`.

**Rules**
- A component wraps a root locator and exposes actions, for example `new DataTable(page.getByRole('table'))`.
- Must not import from any module (`src/modules/*`).
- Page objects compose components; tests normally use the page object, not the component directly.

**Example (real):** `UserMenu.ts` is the header menu on every logged-in page.

```ts
const userMenu = new UserMenu(page);
await userMenu.expectVisible();
await userMenu.logout();            // opens the menu, clicks Logout
```
