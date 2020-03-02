import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { setUserPrefs, setThemePrefs, setLayoutPrefs } from "../store/actions";

import themes, { themeSets } from "../style/themes";
import buildColortheme from "../style/build-color-theme";
import { colorGroups } from "../style/material-design-color-palette";
import Dropdown, { Divider } from "../components/dropdown";
import Button from "../components/button";
import Icon from "../components/icon";

const Indent = styled.div`
  margin-left: 1rem;
`;

const ColorDot = styled.div`
  display: inline-block;
  width: 1em;
  height: 1em;
  margin: 0 0.35em 0 0;
  border-radius: 50%;
  background-color: ${({ theme, color }) => color || theme.highlight};
`;

const PrefMenu = ({
  user,
  userPrefs: redditPrefs,
  authURL,
  logout,
  syncSystemTheme,
  syncRedditTheme,
  darkTheme,
  lightTheme,
  useDarkThemes,
  useSubredditThemes,
  useFlairThemes,
  colorTheme,
  darkSystem,
  split,
  setThemePrefs,
  setLayoutPrefs,
}) => {
  const handleLayoutPrefs = (value) => {
    // console.log("layout prefs", value);
    setLayoutPrefs(value);
  };

  return (
    <Dropdown icon="menu" iconAfter="none">
      {/* <Button label="Messages" icon="mail" to="/messages/" /> */}
      {user ? (
        <Button label={user.name} icon="user" to={`/user/${user.name}`} />
      ) : null}
      <Dropdown
        label="Layout settings"
        hideLabel
        toggle={
          <Button toggle>
            <Icon
              icon={split === "even" ? "columns" : "sidebar"}
              rotate={split === "left" ? "180deg" : undefined}
            />
          </Button>
        }
        iconAfter="none"
      >
        {[
          { mode: "even", icon: "columns", description: "Split evenly" },
          {
            mode: "left",
            icon: "sidebar",
            rotate: "180deg",
            description: "Favor feed",
          },
          { mode: "right", icon: "sidebar", description: "Favor thread" },
        ].map(({ mode, icon, rotate, description }) => (
          <Button
            flat
            primary
            toggled={split === mode}
            value={{ split: mode }}
            key={mode}
            onClick={handleLayoutPrefs}
          >
            <Icon icon={icon} rotate={rotate} />
            {description}
          </Button>
        ))}
      </Dropdown>
      <Dropdown
        label="Theme settings"
        hideLabel
        icon={(syncSystemTheme ? darkSystem : useDarkThemes) ? "moon" : "sun"}
        iconAfter="none"
      >
        <Button
          onClick={setThemePrefs}
          value={{ syncSystemTheme: true }}
          iconAfter={darkSystem ? "moon" : "sun"}
        >
          <Icon icon={syncSystemTheme ? "checkCircle" : "circle"} />
          System
        </Button>
        {themeSets.map(({ name, dark, set }) => (
          <React.Fragment key={name}>
            <Button
              onClick={setThemePrefs}
              value={{ useDarkThemes: dark, syncSystemTheme: false }}
              fill
              flat
              iconAfter={dark ? "moon" : "sun"}
            >
              <Icon
                icon={
                  !syncSystemTheme && useDarkThemes === dark
                    ? "checkCircle"
                    : "circle"
                }
              />
              {name}
            </Button>
            <Indent>
              {set.map((theme) => {
                let value = theme.dark
                  ? { darkTheme: theme.id }
                  : { lightTheme: theme.id };
                if (!(syncSystemTheme && syncRedditTheme))
                  value.useDarkThemes = theme.dark;

                return (
                  <ThemeProvider theme={theme} key={theme.name}>
                    <Button onClick={setThemePrefs} value={value}>
                      <Icon
                        icon={
                          darkTheme === theme.id || lightTheme === theme.id
                            ? syncSystemTheme
                              ? darkSystem === theme.dark
                                ? "checkCircle"
                                : "xCircle"
                              : useDarkThemes === theme.dark
                              ? "checkCircle"
                              : "xCircle"
                            : "circle"
                        }
                      />
                      {theme.name}
                    </Button>
                  </ThemeProvider>
                );
              })}
            </Indent>
          </React.Fragment>
        ))}
        <Divider />
        <Dropdown
          toggle={
            <Button flat fill>
              <Icon icon="chevronLeft" align="none" />
              <ColorDot /> Color
            </Button>
          }
          iconAfter="none"
        >
          {Object.entries(colorGroups).map(([id, { name }]) => {
            const theme = buildColortheme(
              id,
              syncSystemTheme ? darkSystem : useDarkThemes
            );
            return (
              <Button
                onClick={setThemePrefs}
                value={{ colorTheme: id }}
                fill
                key={id}
                flat
              >
                <Icon
                  icon={colorTheme === id ? "checkCircle" : "circle"}
                  align="none"
                />
                <ThemeProvider
                  theme={{
                    ...themes.light,
                    ...theme,
                    button: {
                      ...themes.light.button,
                      ...theme.button,
                    },
                  }}
                  key={id}
                >
                  <ColorDot />
                </ThemeProvider>
                {name}
              </Button>
            );
          })}
        </Dropdown>
        {/* <Divider /> */}
        {[
          {
            value: { useSubredditThemes: !useSubredditThemes },
            toggle: useSubredditThemes,
            description: "Use subreddit themes",
          },
          {
            value: { useFlairThemes: !useFlairThemes },
            toggle: useFlairThemes,
            description: "Use flair themes",
          },
        ].map(({ value, toggle, description }) => (
          <Button onClick={setThemePrefs} value={value} key={description}>
            <Icon icon={toggle ? "checkSquare" : "square"} />
            {description}
          </Button>
        ))}
      </Dropdown>
      <Divider />
      {user ? (
        <Button onClick={logout}>
          <Icon icon="logout" />
          Logout
        </Button>
      ) : (
        <Button primary href={authURL}>
          <Icon icon="login" />
          Login
        </Button>
      )}
    </Dropdown>
  );
};

export default connect(
  ({
    userPrefs,
    user,
    themePrefs: {
      syncSystemTheme,
      syncRedditTheme,
      darkTheme,
      lightTheme,
      useDarkThemes,
      useSubredditThemes,
      useFlairThemes,
      colorTheme,
      darkSystem,
    },
    layoutPrefs: { split },
    location,
  }) => ({
    userPrefs,
    user,
    syncSystemTheme,
    syncRedditTheme,
    darkTheme,
    lightTheme,
    useDarkThemes,
    useSubredditThemes,
    useFlairThemes,
    colorTheme,
    darkSystem,
    split,
    location,
  }),
  { setUserPrefs, setThemePrefs, setLayoutPrefs }
)(PrefMenu);
