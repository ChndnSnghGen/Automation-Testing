# auth/data

**Why this exists:** test data specific to authentication (for example invalid emails, wrong passwords, locked-account scenarios).

**Put here when:** negative-login cases are added. They need confirmed application behavior and dedicated test accounts first.

**Rules**
- Never commit real credentials. Real values come from `.env`.
- Be careful with repeated failed logins: they can lock the shared account.

**Example (illustrative):**

```ts
export const invalidLogins = [
  { name: 'empty email', email: '', password: 'x' },
  { name: 'malformed email', email: 'not-an-email', password: 'x' },
];
```
