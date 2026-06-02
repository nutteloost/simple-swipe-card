// ESLint flat config (ESLint v9+). Replaces the legacy .eslintrc.json.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Was: "extends": ["eslint:recommended"]
  js.configs.recommended,

  // Was: "extends": ["prettier"] — disables rules that would conflict with Prettier
  prettier,

  {
    files: ['src/**/*.js'],
    // ESLint 9's flat config defaults reportUnusedDisableDirectives to "warn";
    // the legacy .eslintrc default was off. Keep it off so existing
    // eslint-disable comments are preserved (they guard intentional new Function / == usage).
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      // Was: "parserOptions": { ecmaVersion: "latest", sourceType: "module" }
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Was: "env": { "browser": true } — provides window, document,
      // customElements, CustomEvent, etc. (superset of the old explicit globals list)
      globals: {
        ...globals.browser,
      },
    },
    // Was: "rules": { ... }. caughtErrors: "none" restores the ESLint 8 default
    // (v9 changed it to "all", which flagged unused catch bindings).
    rules: {
      'no-unused-vars': ['warn', { caughtErrors: 'none' }],
      'no-console': 'off',
      'prefer-const': 'error',
    },
  },
];
