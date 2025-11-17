import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginQuery from '@tanstack/eslint-plugin-query'
import typescript from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      'dist/**', 
      'node_modules/**', 
      '.output/**', 
      '.nitro/**',
      '.tanstack/**',
      'src/routeTree.gen.ts'
    ]
  },
  // Config files without TypeScript project requirement
  {
    files: ['*.config.{js,ts}', 'vite.config.ts'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off'
    }
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@tanstack/router': pluginRouter,
      '@tanstack/query': pluginQuery
    },
    rules: {
      // TypeScript rules matching budget repo
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // TanStack Router recommended rules
      ...pluginRouter.configs['flat/recommended'].rules,

      // TanStack Query recommended rules
      ...pluginQuery.configs['flat/recommended'].rules
    }
  },
  // Disable unsafe type rules for server functions and files that use them
  // This is necessary due to a TypeScript inference limitation with TanStack Start middleware
  {
    files: [
      'src/server/**/*.ts',
      'src/server.ts',
      'src/middleware/**/*.ts',
      'src/utils/posts.tsx',
      'src/lib/queries.ts',
      'src/components/**/*.tsx',
      'src/routes/**/*.tsx',
      'src/routes/**/*.ts'
    ],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off'
    }
  }
]