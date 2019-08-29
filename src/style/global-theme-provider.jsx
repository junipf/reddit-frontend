import React, { useContext, useMemo, useEffect } from "react";
import { ThemeProvider, withTheme } from "styled-components";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import themes from "./themes";
import buildColorTheme from "./build-color-theme";
import { setUserPrefs, setThemePrefs } from "../store/actions";

const GlobalThemeProvider = ({
  themePrefs,
  subredditTheme,
  theme: inheritedTheme,
  userPrefs,
  setUserPrefs,
  setThemePrefs,
  ...props
}) => {
  const r = useContext(Requester);
  const theme = useMemo(() => {
    const {
      useDarkThemes,
      darkTheme,
      lightTheme,
      useSubredditThemes,
      colorTheme,
      darkSystem,
      syncSystemTheme,
      syncRedditTheme,
    } = themePrefs;
    const useDark = syncSystemTheme
      ? darkSystem
      : syncRedditTheme
      ? userPrefs.nightmode
      : useDarkThemes;
    const base =
      useSubredditThemes && subredditTheme
        ? useDark
          ? subredditTheme.dark
          : subredditTheme.light
        : themes[useDark ? darkTheme : lightTheme];
    return {
      ...base,
      ...buildColorTheme(colorTheme, useDark),
    };
  }, [themePrefs, userPrefs.nightmode, subredditTheme]);

  useEffect(() => {
    const DarkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    setThemePrefs({ darkSystem: DarkSystemTheme.matches });
    const handleSystemThemeChange = (e) => {
      setThemePrefs({ darkSystem: e.matches });
      if (themePrefs.syncSystemTheme && r)
        r.updatePreferences({ nightmode: e.matches }).then((result) =>
          setUserPrefs(result)
        );
    };

    DarkSystemTheme.addListener(handleSystemThemeChange);

    return () => {
      DarkSystemTheme.removeListener(handleSystemThemeChange);
    };
  }, [r, themePrefs.syncSystemTheme, setThemePrefs, setUserPrefs]);

  return <ThemeProvider theme={theme} {...props} />;
};

GlobalThemeProvider.defaultProps = {
  theme: themes.light,
};

export default connect(
  ({ userPrefs, themePrefs, themesBySubreddit, location }) => ({
    userPrefs,
    themePrefs,
    subredditTheme:
      location.type === "subreddit" && themesBySubreddit[location.name]
        ? themesBySubreddit[location.name]
        : null,
  }),
  { setUserPrefs, setThemePrefs }
)(withTheme(GlobalThemeProvider));
