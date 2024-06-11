module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    'vitest/globals': true // Add Vitest globals here
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier', // Add Prettier last to override other configs
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: '18.2'
    }
  },
  plugins: [
    'react-refresh',
    'prettier'
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
      },
    ],
    'prettier/prettier': 'error', // Add this rule to show Prettier errors in ESLint
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        'vitest/globals': true // Vitest globals for test files
      },
      globals: {
        'describe': 'readonly',
        'it': 'readonly',
        'expect': 'readonly'
      }
    }
  ]
};
