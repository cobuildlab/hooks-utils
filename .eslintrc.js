module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['jsdoc', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'plugin:jsdoc/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['lib/**/*.js.', 'lib/*.js'],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    semi: [2, 'always'],
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-hyphen-before-param-description': 1,
  },
};
