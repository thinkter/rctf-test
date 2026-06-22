module.exports = {
  env: {
    browser: true,
    'vue/setup-compiler-macros': true,
  },
  globals: {
    defineOptions: 'readonly',
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.playwright.json'],
    extraFileExtensions: ['.vue'],
  },
  plugins: [],
  rules: {
    radix: 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/v-on-event-hyphenation': 'off',
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'lib/**/*', '*.config*.[jt]s?(x)'],
      parser: 'espree',
      parserOptions: {
        project: null,
        parser: null,
      },
    },
    {
      files: ['*.vue', 'src/**/*.vue'],
      rules: {
        'prettier/prettier': 'off',
      },
    },
    {
      files: ['*.test.[jt]s?(x)'],
      extends: ['plugin:jest/recommended', 'plugin:jest-dom/recommended'],
    },
  ],
  ignorePatterns: ['index.js', 'index.d.ts'],
}
