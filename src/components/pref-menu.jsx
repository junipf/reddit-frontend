import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import {
  setUseSystemTheme,
  setUserPrefs,
  setThemePrefs,
} from "../store/actions";
import { Requester } from "../components/requester";

import themes, { lightThemes, darkThemes } from "../style/themes";

import Dropdown, { Divider } from "./dropdown";
import Button from "./button";
import Icon from "./icon";

const Indent = styled.div`
  margin-left: 1rem;
`;

class PrefMenu extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      darkSystem: false,
    };
  }
  componentWillMount() {
    const DarkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setState({ darkSystem: DarkSystemTheme.matches });
    DarkSystemTheme.addListener(this.handleSystemThemeChange);
  }
  componentWillUnmount() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeListener(this.handleSystemThemeChange);
  }
  handleSystemThemeChange = (e) => {
    const { setUserPrefs, useSystemTheme } = this.props;

    this.setState({ darkSystem: e.matches });
    if (useSystemTheme)
      this.context
        .updatePreferences({ nightmode: e.matches })
        .then((result) => setUserPrefs(result));
  };
  handleUserThemeChange = (value) => {
    const {
      setUseSystemTheme,
      setUserPrefs,
      useSystemTheme,
      userPrefs,
      themePrefs,
      setThemePrefs,
    } = this.props;

    if (value === "system") {
      if (!useSystemTheme) setUseSystemTheme(true);
    } else {
      if (useSystemTheme) setUseSystemTheme(false);
    }

    const { name, dark } = value;

    const nightmode =
      value === "dark" || (value === "system" && this.state.darkSystem);
    if (userPrefs.nightmode !== nightmode)
      this.context
        .updatePreferences({ nightmode })
        .then((result) => setUserPrefs(...result));

    setThemePrefs({
      system: value === "system" ? true : false,
    });
  };
  toggleSystemTheme = () => {};
  render() {
    const {
      user,
      userPrefs: { nightmode } = {},
      authURL,
      toggleNightmode,
      useDarkTheme,
      logout,
      currentThemeName,
      themePrefs: { syncSystemTheme, syncRedditTheme, dark, light, useDark },
      setThemePrefs,
    } = this.props;
    const { darkSystem } = this.state;
    if (user)
      return (
        <>
          <Dropdown
            select
            label="Theme"
            icon={nightmode ? "moon" : "sun"}
            {...this.props}
          >
            <Button onClick={setThemePrefs} value={{ useDark: false }}>
              <Icon icon={useDark ? "circle" : "checkCircle"} />
              Light theme
            </Button>
            <Indent>
              {Object.entries(lightThemes).map(([key, theme]) => (
                <ThemeProvider theme={theme}>
                  <Button
                    onClick={setThemePrefs}
                    value={{ useDark: false, light: theme.name }}
                    type="secondary"
                    // size="fill"
                  >
                    <Icon
                      icon={
                        !useDark && light === theme.name
                          ? "checkCircle"
                          : light === theme.name
                          ? "disc"
                          : "circle"
                      }
                    />
                    <Icon icon={theme.icon} />
                    {theme.name}
                  </Button>
                </ThemeProvider>
              ))}
            </Indent>
            <Button onClick={setThemePrefs} value={{ useDark: true }}>
              <Icon icon={useDark ? "checkCircle" : "circle"} />
              Dark theme
            </Button>
            <Indent>
              {Object.entries(darkThemes).map(([key, theme]) => (
                <ThemeProvider theme={theme}>
                  <Button
                    onClick={setThemePrefs}
                    value={{ useDark: true, dark: theme.name }}
                    type="secondary"
                    // size="fill"
                  >
                    <Icon
                      icon={
                        useDark && dark === theme.name
                        ? "checkCircle"
                        : dark === theme.name
                        ? "disc"
                        : "circle"
                      }
                    />
                    <Icon icon={theme.icon} />
                    {theme.name}
                  </Button>
                </ThemeProvider>
              ))}
            </Indent>
            <Divider />
            <Button
              onClick={setThemePrefs}
              value={{ syncSystemTheme: !syncSystemTheme }}
            >
              <Icon icon={syncSystemTheme ? "checksquare" : "square"} />
              Sync with system (
              <Icon icon={darkSystem ? "moon" : "sun"} noMargin />)
            </Button>
            <Button
              onClick={setThemePrefs}
              value={{ syncRedditTheme: !syncRedditTheme }}
            >
              <Icon icon={syncRedditTheme ? "checksquare" : "square"} />
              Sync with reddit (
              <Icon icon={nightmode ? "moon" : "sun"} noMargin />)
            </Button>
          </Dropdown>
          <Dropdown label={user.name} expand>
            <Button label="Messages" icon="mail" to="/messages/" />
            <Button label="Profile" icon="user" to="/user/me" />
            <Divider />
            <Button label="Log out" icon="logout" onClick={logout} />
          </Dropdown>
        </>
      );
    else
      return (
        <>
          <Button
            type="secondary"
            onClick={toggleNightmode}
            icon={useDarkTheme ? "moon" : "sun"}
          />
          <Button
            type="primary"
            href={authURL}
            icon="login"
            label="Login"
            size="large"
          />
        </>
      );
  }
}

function mapStateToProps(state) {
  const { useSystemTheme, userPrefs, user, themePrefs } = state;
  return {
    useSystemTheme,
    userPrefs,
    user,
    themePrefs,
  };
}

export default connect(
  mapStateToProps,
  { setUseSystemTheme, setUserPrefs, setThemePrefs }
)(PrefMenu);
