// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 2024,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.es2024,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        files: ['./src/**/*.ts'], // To oznacza wszystkie pliki .ts w katalogu src i jego podkatalogach
        rules: {
            ...js.configs.recommended.rules,
            ...typescript.configs.recommended.rules,
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/type-annotation-spacing': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                { accessibility: 'explicit' },
            ],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            indent: ['error', 2],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'max-len': ['error', { code: 100 }],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
            'prefer-const': 'error',
            'arrow-parens': ['error', 'always'],
            'arrow-spacing': ['error', { before: true, after: true }],
        },
    },
];
