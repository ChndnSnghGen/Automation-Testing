// Add qa/staging here once their URLs are confirmed; select one with TEST_ENV.
export const environments = {
  dev: { baseURL: 'https://devportal.paydc.com/' },
} as const;

export type EnvironmentName = keyof typeof environments;
