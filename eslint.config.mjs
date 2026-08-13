import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      // git worktree do agent tạo để làm việc song song — là bản sao của chính repo này,
      // lint từ thư mục gốc sẽ soi lại toàn bộ (kể cả .next/ bên trong) và báo trùng.
      // Mỗi worktree tự lint bằng config riêng của nó.
      '.claude/**',
      'next-env.d.ts',
      'Baron TFT Design System/**',
      'exports/**',
      'archive/**',
      '*.dc.html',
      'support.js',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: [
      'scripts/db/apply-pbe-champion-updates.ts',
      'scripts/db/apply-pbe-champion-updates-aug04-05.ts',
      'scripts/db/apply-pbe-champion-updates-aug06z.ts',
      'scripts/db/apply-pbe-champion-updates-aug07aa.ts',
      'scripts/db/apply-pbe-champion-updates-aug10ab.ts',
      'scripts/db/apply-pbe-trait-augment-updates.ts',
      'scripts/db/apply-pbe-balance-tft18-1ac.ts',
      'scripts/db/apply-pbe-balance-tft18-1ad.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'off',
    },
  },
  {
    files: ['scripts/db/apply-pbe-champion-updates.ts', 'scripts/db/fix-patch-order-pbe.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];

export default config;
