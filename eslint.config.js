import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
    prettierConfig,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    prettier: prettier,
    import: importPlugin,
  },
  rules: {
    'prettier/prettier': 'error',
    // Import 순서 정렬 규칙
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js 내장 모듈
          'external', // 외부 라이브러리
          'internal', // 내부 모듈
          'parent', // 상위 디렉터리
          'sibling', // 같은 디렉터리
          'index', // index 파일
          'object', // 객체 import
          'type', // 타입 import
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        endOfLine: 'auto',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
});
