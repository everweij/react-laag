import { create } from "@storybook/theming/create";
import sbLogo from "./sblogo.png";

export const theme = create({
  base: "light",

  colorPrimary: "green",
  colorSecondary: "#dc68b3",

  // UI
  appBg: "#fdf7fb",
  appContentBg: "white",
  appBorderColor: "#f7e0ef",
  appBorderRadius: 4,

  // Typography
  fontCode: "Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace",

  // Text colors
  textColor: "black",
  textInverseColor: "rgba(255,255,255,0.9)",

  // Toolbar default and active colors
  barTextColor: "#e0b9d1",
  barSelectedColor: "#b72c86",

  // Form colors
  inputBg: "white",
  inputBorder: "purple",
  inputTextColor: "black",
  inputBorderRadius: 4,

  brandTitle: "react-laag",
  brandUrl: "https://www.react-laag.com",
  brandImage: sbLogo
});
