import path from 'node:path';
import { environments, type EnvironmentName } from './environments';

function resolveEnvironment(): { name: string; baseURL: string } {
  const name = process.env.TEST_ENV?.trim() || 'dev';
  const override = process.env.BASE_URL?.trim();
  if (override) return { name, baseURL: override };

  if (!(name in environments)) {
    throw new Error(
      `Unknown TEST_ENV "${name}". Use one of: ${Object.keys(environments).join(', ')}, or set BASE_URL.`,
    );
  }
  return { name, baseURL: environments[name as EnvironmentName].baseURL };
}

const resolved = resolveEnvironment();

export const env = {
  name: resolved.name,
  baseURL: resolved.baseURL,
  captureArtifacts: process.env.PW_CAPTURE_ARTIFACTS === '1',
  authStateFile: path.resolve(__dirname, '../../../playwright/.auth/user.json'),
} as const;

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing ${name}. Set it in .env or your CI secret store.`);
  }
  return value;
}

export function requiredUrlEnv(name: string): string {
  const value = requiredEnv(name);
  if (!URL.canParse(value) || !/^https?:$/.test(new URL(value).protocol)) {
    throw new Error(`${name} must be an absolute HTTP or HTTPS URL.`);
  }
  return value;
}
