import React, { useMemo } from "react";
import { connect } from "react-redux";
import { ThemeProvider, withTheme } from "styled-components";
import { genThemeSync } from "./gen-theme";

const SubredditThemeProvider = ({
  theme: inheritedTheme,
  color,
  themePrefs: { useSubredditThemes },
  ...props
}) => {
  const theme = useMemo(() => genThemeSync({ color, simple: false }), [color]);

  return useSubredditThemes && theme ? (
    <ThemeProvider
      theme={inheritedTheme.dark ? { ...theme.dark } : { ...theme.light }}
      {...props}
    />
  ) : (
    <ThemeProvider theme={inheritedTheme} {...props} />
  );
};

export default connect(
  ({ themePrefs, subreddits }, { sub, subName, color }) => ({
    themePrefs,
    color:
      color ||
      (sub && sub.primary_color && sub.primary_color !== ""
        ? sub.primary_color
        : subreddits && subreddits[subName] && subreddits[subName].primary_color
        ? subreddits[subName].primary_color
        : null),
  })
)(withTheme(SubredditThemeProvider));
