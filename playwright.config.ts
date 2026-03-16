import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  expect: {
    timeout: 15000,
  },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // UI tests — all browsers, fully parallel
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://automationexercise.com' },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://automationexercise.com' },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: 'https://automationexercise.com' },
    },

    // API tests — chromium only, serial
    {
      name: 'api',
      testDir: './tests/api',
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'], baseURL: 'https://automationexercise.com/api' },
    },
  ],
});