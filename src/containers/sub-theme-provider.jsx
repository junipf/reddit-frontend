import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ThemeProvider, withTheme } from "styled-components";
import { addSubredditTheme } from "./../store/actions";

const SubredditThemeProvider = ({
  theme: inheritedTheme,
  themesBySubreddit,
  subName,
  addSubredditTheme,
  themePrefs,
  ...props
}) => {
  const [theme, setTheme] = useState(inheritedTheme);
  useEffect(() => {
    if (
      themePrefs.useSubredditThemes &&
      subName &&
      themesBySubreddit[subName.toLowerCase()]
    ) {
      setTheme(
        themePrefs.useDarkThemes
          ? themesBySubreddit[subName].dark
          : themesBySubreddit[subName].light
      );
    } else {
      setTheme(inheritedTheme);
    }
  }, [inheritedTheme, themesBySubreddit, subName, themePrefs]);
  return <ThemeProvider theme={theme} {...props} />;
};

export default connect(
  ({ themesBySubreddit, themePrefs }) => ({ themesBySubreddit, themePrefs }),
  { addSubredditTheme }
)(withTheme(SubredditThemeProvider));
