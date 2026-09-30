import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  // Les specs partagent la meme base de donnees backend et certains scenarios
  // se suivent (create -> edit -> delete) : un seul worker, pas de parallelisme.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
