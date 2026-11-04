import { requiredEnv, requiredUrlEnv } from '@core/config/env';

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginSettings {
  credentials: Credentials;
  expectedURL: string;
}

// Read lazily so suites that never log in (contracts, examples) run without secrets.
export function getLoginSettings(): LoginSettings {
  return {
    credentials: { email: requiredEnv('LOGIN_EMAIL'), password: requiredEnv('LOGIN_PASSWORD') },
    expectedURL: requiredUrlEnv('LOGIN_SUCCESS_URL'),
  };
}
