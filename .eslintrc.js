module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["node_modules/", "**/node_modules/"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "import/named": "off",
    "import/namespace": "off",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
      },
    ],
  },
};
