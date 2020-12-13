module.exports = {
  extends: [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/no-redeclare": "off"
  }
};
