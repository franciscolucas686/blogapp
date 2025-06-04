import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'build']
  },
  {
    files: ['**/*.{ts,tsx,mjs}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    languageOptions: {
      ecmaVersion: 2020,

      parserOptions: {
        ecmaVersion: 10,
        sourceType: 'module',
        ecmaFeatures: { modules: true, jsx: true }
      }
    },

    plugins: {
      'react': pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': pluginPrettier,
      'unused-imports': pluginUnusedImports,
      '@tanstack/query': pluginQuery,
      'import': pluginImport
    },

    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginPrettier.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'unused-imports/no-unused-imports': 'error',
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      'max-lines': ['error', 300],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true, args: 'none' }
      ],

      'import/order': [
        'error',
        {
          'alphabetize': { order: 'asc', caseInsensitive: true },
          'groups': ['builtin', ['external', 'internal'], ['parent', 'sibling', 'index'], 'object'],
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': ['react', 'antd'],
          'pathGroups': [
            { pattern: 'react**', group: 'builtin', position: 'before' },
            { pattern: 'antd', group: 'builtin' },
            { pattern: 'antd/**', group: 'builtin' },
            { pattern: '@/**', group: 'internal', position: 'after' }
          ]
        }
      ],

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['block-like', 'function'], next: '*' },
        { blankLine: 'always', prev: ['*'], next: ['block-like', 'function'] },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'any', prev: ['export', 'import'], next: ['export', 'import'] },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['export'] }
      ]
    }
  }
);