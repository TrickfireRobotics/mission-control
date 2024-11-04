/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const js = require('@eslint/js');
const eslintPluginVue = require('eslint-plugin-vue');
const ts = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const { includeIgnoreFile } = require('@eslint/compat');
const path = require('node:path');

const gitignorePath = path.resolve(__dirname, '.gitignore');

module.exports = ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'vue/multi-word-component-names': ['off'],
    },
  },
  {
    rules: prettier.rules,
  },
);
