module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true, // Enable modern JavaScript features
  },
  extends: [
    "plugin:vue/vue3-recommended", // Vue 3 recommended rules
    "eslint:recommended", // ESLint recommended rules
    "@vue/prettier", // Prettier formatting rules
  ],
  parserOptions: {
    parser: "@babel/eslint-parser", // Use Babel parser for JavaScript
    requireConfigFile: false, // Don't require Babel config file
    ecmaVersion: 2021, // Support ES2021 features
    sourceType: "module", // Allow ES modules
  },
  rules: {
    "no-undef": "off", // Turn off 'undefined' errors for certain properties
    "vue/script-setup-uses-vars": "error", // Enable variable tracking in Vue script setup
    "endOfLine": 0, // Ignore line endings
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "no-unused-vars": "off", // Turn off 'no-unused-vars' for Vue files (Vue handles it)
      },
    },
  ],
};
