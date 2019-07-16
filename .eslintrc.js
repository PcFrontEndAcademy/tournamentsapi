module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "linebreak-style": 0,
    "no-bitwise": 0,
    "indent": ["error", 4],
    "no-plusplus":0,
    "no-underscore-dangle": ["error", { "allow": ["_id"] }]
  },
};
