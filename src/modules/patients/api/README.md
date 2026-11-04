# patients/api

**Why this exists:** API helpers that set up or clean up patient data without going through the UI. This makes tests faster, more stable and independent of each other.

**Put here when:** a test needs a precondition (for example "an existing patient") or cleanup of data it created.

**Rules**
- Use Playwright's `request` fixture / `APIRequestContext`.
- Only for setup and teardown. The behavior under test should still be exercised through the UI.
- Expose helpers through a fixture in `fixtures/`, and never hardcode credentials or tokens.

**Example (illustrative; endpoint must be confirmed):**

```ts
export async function createPatient(request: APIRequestContext, p: PatientDetails) {
  const res = await request.post('/api/patients', { data: p });
  return (await res.json()).id as string;
}
export const deletePatient = (request: APIRequestContext, id: string) =>
  request.delete(`/api/patients/${id}`);
```
