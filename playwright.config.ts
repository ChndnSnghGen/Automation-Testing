import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/core/config/env';

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

// Test type is chosen by folder inside each module's tests/ directory.
const GUEST_TESTS = '**/tests/guest/**/*.spec.ts';
const CONTRACT_TESTS = '**/tests/contract/**/*.spec.ts';
// Starting point for the Playwright test agents; runs once, not per browser.
const SEED_TEST = '**/seed.spec.ts';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/modules',
  // Each new browser context spends ~30s booting the portal's WebAssembly runtime.
  timeout: 120_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.baseURL,

    trace: env.captureArtifacts ? 'retain-on-failure' : 'off',
    screenshot: env.captureArtifacts ? 'only-on-failure' : 'off',
    video: 'off',
  },

  projects: [
    // Projects that submit the login form never retry: repeated rejected logins can lock the shared account.
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      retries: 0,
      use: { ...devices['Desktop Chrome'] },
    },
    ...browsers.flatMap(({ name, device }) => [
      {
        name: `guest-${name}`,
        testMatch: GUEST_TESTS,
        retries: 0,
        use: { ...device },
      },
      {
        name,
        testMatch: '**/*.spec.ts',
        testIgnore: [GUEST_TESTS, CONTRACT_TESTS, SEED_TEST],
        dependencies: ['setup'],
        use: { ...device, storageState: env.authStateFile },
      },
    ]),
    {
      name: 'seed',
      testMatch: SEED_TEST,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: env.authStateFile },
    },
    {
      name: 'contracts',
      testMatch: CONTRACT_TESTS,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
