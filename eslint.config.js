import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import pluginPrettier from 'eslint-plugin-prettier' // ← 追加
import configPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  configPrettier,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    // ✅ Prettier plugin をここに登録
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      // ✅ plugin:prettierを読み込んだので、ルールを有効化
      'prettier/prettier': 'error',
    },
  },
])
