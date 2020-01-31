import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { setUserPrefs, setThemePrefs, setLayoutPrefs } from "../store/actions";

import themes, { themeSets } from "../style/themes";
import buildColortheme from "../style/build-color-theme";
import { colorGroups } from "../style/material-design-color-palette";
import Dropdown, { Divider } from "./dropdown";
import Button from "./button";
import Icon from "./icon";

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
  setThemePrefs,
  setLayoutPrefs,
  location,
}) => (
  <>
    <Dropdown
      select
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
      onSelect={setLayoutPrefs}
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
            <Icon icon="chevronLeft" align="none"/>
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
              <Icon icon={colorTheme === id ? "checkCircle" : "circle"} align="none"/>
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
      <Button
        onClick={setThemePrefs}
        value={{ useSubredditThemes: !useSubredditThemes }}
      >
        <Icon icon={useSubredditThemes ? "checkSquare" : "square"} />
        Use subreddit themes
      </Button>
      <Button
        onClick={setThemePrefs}
        value={{ useFlairTheme: !useFlairThemes }}
      >
        <Icon icon={useFlairThemes ? "checkSquare" : "square"} />
        Use flair themes
      </Button>
    </Dropdown>
    {user ? (
      <Dropdown label={user.name} expand>
        <Button label="Messages" icon="mail" to="/messages/" />
        <Button label="Profile" icon="user" to="/user/me" />
        <Divider />
        <Button label="Log out" icon="logout" onClick={logout} />
      </Dropdown>
    ) : (
      <Button primary href={authURL} icon="login" label="Login" />
    )}
  </>
);

export default connect(
  ({ userPrefs, user, themePrefs, layoutPrefs, location }) => ({
    userPrefs,
    user,
    themePrefs,
    layoutPrefs,
    location,
  }),
  { setUserPrefs, setThemePrefs, setLayoutPrefs }
)(PrefMenu);
