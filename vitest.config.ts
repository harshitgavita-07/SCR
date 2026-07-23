export default {
  rootDir: '.',
  testTimeout: 10000,
  globals: true,
  environment: 'node',
  include: ['tests/**/*.test.ts'],
  exclude: ['node_modules', 'dist', 'coverage'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'dist', 'tests', '**/*.d.ts'],
    threshold: {
      global: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  typecheck: {
    enabled: true,
    tsconfig: './tsconfig.json',
  },
  resolveSnapshotPath: (test, extension) => {
    return test.replace(/\.test\.ts$/, `${extension}.snap`);
  },
};
