# core/utils

**Why this exists:** small, generic helpers used across modules (date formatting, random IDs, string helpers, retry wrappers).

**Put here when:** the same helper is needed in two or more places.

**Rules**
- Pure functions where possible; no Playwright page state and no module knowledge.
- Must not import from any module.
- Example: `export const digitsOnly = (s: string) => s.replace(/\D/g, '');` then `digitsOnly('(555) 123-4567') // '5551234567'`.
- If a helper is about a UI widget, it belongs in `core/components/`. If it builds test data, it belongs in `core/data/`.
