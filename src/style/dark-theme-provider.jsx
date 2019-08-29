import React from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import themes from "./themes";
import buildColorTheme from "./build-color-theme";

const DarkThemeProvider = ({ themePrefs, ...props }) => (
  <ThemeProvider
    theme={{ ...themes.dark, ...buildColorTheme(themePrefs.colorTheme, true) }}
    {...props}
  />
);

export default connect(({ themePrefs }) => ({
  themePrefs,
}))(DarkThemeProvider);
