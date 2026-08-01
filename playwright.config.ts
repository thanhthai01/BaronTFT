import { defineConfig, devices } from '@playwright/test';

/* `reuseExistingServer` bên dưới sẽ bám vào bất kỳ server nào đang giữ cổng này — kể cả
   server của một git worktree khác, khiến e2e âm thầm test nhầm cây code. Cho phép đổi
   cổng qua env để mỗi worktree chạy trên cổng riêng: E2E_PORT=3200 pnpm test:e2e */
const e2ePort = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://127.0.0.1:${e2ePort}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next dev -p ${e2ePort}`,
    url: `http://127.0.0.1:${e2ePort}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'], browserName: 'chromium' },
    },
    {
      name: 'tablet-chromium',
      use: { ...devices['iPad Mini'], browserName: 'chromium' },
    },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
    },
  ],
});
