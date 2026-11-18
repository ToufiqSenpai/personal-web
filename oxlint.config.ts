import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'react', 'import', 'oxc'],
  categories: {
    correctness: 'error',
    suspicious: 'off',
    pedantic: 'off',
    perf: 'off',
    nursery: 'off',
    style: 'off',
  },
  options: {
    typeAware: true,
    maxWarnings: 0,
  },
  rules: {
    'eslint/max-lines': 'off',
    'eslint/max-lines-per-function': 'off',
    'typescript/no-unnecessary-condition': ['error', { checkTypePredicates: true }],
    'typescript/no-unnecessary-type-assertion': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'unicorn/prefer-node-protocol': 'off',
  },
  ignorePatterns: [
    'src/payload-types.ts',
    'src/payload-generated.schema.ts',
    'src/app/_payload/**',
    'src/paraglide/**',
    'src/routeTree.gen.ts',
    'src/migrations/**',
    'dist/**',
    'node_modules/**',
  ],
})
