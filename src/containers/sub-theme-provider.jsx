import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ThemeProvider, withTheme } from "styled-components";
import { addSubredditTheme } from "./../store/actions";

const SubredditThemeProvider = ({
  theme: inheritedTheme,
  themesBySubreddit,
  subName,
  addSubredditTheme,
  nightmode,
  ...props
}) => {
  const [theme, setTheme] = useState(inheritedTheme);
  useEffect(() => {
    if (subName && themesBySubreddit[subName.toLowerCase()]) {
      setTheme(
        nightmode
          ? themesBySubreddit[subName].dark
          : themesBySubreddit[subName].light
      );
    } else {
      setTheme(inheritedTheme);
    }
  }, [inheritedTheme, themesBySubreddit, subName, nightmode]);
  return <ThemeProvider theme={theme} {...props} />;
};

function mapStateToProps(state) {
  const {
    themesBySubreddit,
    userPrefs: { nightmode },
  } = state;
  return { themesBySubreddit, nightmode };
}

export default connect(
  mapStateToProps,
  { addSubredditTheme }
)(withTheme(SubredditThemeProvider));
