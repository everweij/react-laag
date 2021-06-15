module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  extends: ["react-app", "prettier", "plugin:prettier/recommended"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-redeclare": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"]
  }
};
