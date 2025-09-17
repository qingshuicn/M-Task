import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const ignores = tseslint.config({
  ignores: ['dist', 'build', 'coverage', 'node_modules']
});

const typescriptConfigs = tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['tsconfig.json', 'tsconfig.node.json', 'tsconfig.spec.json', 'backend/tsconfig.spec.json']
        },
        tsconfigRootDir: projectRoot
      }
    }
  }
);

const testOverrides = tseslint.config({
  files: ['**/*.spec.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off'
  }
});

const reactConfigs = tseslint.config({
  files: ['frontend/**/*.{ts,tsx}'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off'
  }
});

export default tseslint.config(
  js.configs.recommended,
  prettier,
  ignores,
  ...typescriptConfigs,
  testOverrides,
  reactConfigs
);
