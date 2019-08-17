import React, { useMemo } from "react";
import { ThemeProvider, withTheme } from "styled-components";
import { connect } from "react-redux";
import themes from "../style/themes";

const GlobalThemeProvider = ({
  themePrefs,
  subredditTheme,
  theme: inheritedTheme,
  ...props
}) => {
  const theme = useMemo(() => {
    const {
      useDarkThemes,
      darkTheme,
      lightTheme,
      useSubredditThemes,
    } = themePrefs;
    return useSubredditThemes && subredditTheme
      ? useDarkThemes
        ? subredditTheme.dark
        : subredditTheme.light
      : themes[useDarkThemes ? darkTheme : lightTheme];
  }, [themePrefs, subredditTheme]);

  return <ThemeProvider theme={theme} {...props} />;
};

GlobalThemeProvider.defaultProps = {
  theme: themes.light,
};

export default connect(({ themePrefs, themesBySubreddit, location }) => ({
  themePrefs,
  subredditTheme:
    location.type === "subreddit" && themesBySubreddit[location.name]
      ? themesBySubreddit[location.name]
      : null,
}))(withTheme(GlobalThemeProvider));
