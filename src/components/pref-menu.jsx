import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { setUserPrefs, setThemePrefs } from "../store/actions";
import { Requester } from "../components/requester";

import { themeSets } from "../style/themes";

import Dropdown, { Divider } from "./dropdown";
import Button from "./button";
import Icon from "./icon";

const Indent = styled.div`
  margin-left: 1rem;
  /* list-style: none; */
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
  toggleSystemTheme = () => {};
  render() {
    const {
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
      },
      setThemePrefs,
      location,
    } = this.props;
    const { darkSystem } = this.state;
    return (
      <>
        <Dropdown
          select
          label="Theme settings"
          hideLabel
          icon={useDarkThemes ? "moon" : "sun"}
          iconAfter="none"
          {...this.props}
        >
          {themeSets.map((themeSet) => (
            <React.Fragment key={themeSet.name}>
              <Button
                onClick={setThemePrefs}
                value={{ useDarkThemes: themeSet.dark }}
                size="fill"
                type="flat"
              >
                <Icon
                  icon={
                    useDarkThemes === themeSet.dark ? "checkCircle" : "circle"
                  }
                />
                {themeSet.name}
              </Button>
              <Indent>
                {themeSet.set.map((theme) => (
                  <ThemeProvider theme={theme} key={theme.name}>
                    <Button
                      onClick={setThemePrefs}
                      value={
                        theme.dark
                          ? { useDarkThemes: true, darkTheme: theme.id }
                          : { useDarkThemes: false, lightTheme: theme.id }
                      }
                      type="secondary"
                    >
                      <Icon
                        icon={
                          useDarkThemes === theme.dark &&
                          (darkTheme === theme.id || lightTheme === theme.id) &&
                          !(useSubredditThemes && location.type === "subreddit")
                            ? "checkCircle"
                            : darkTheme === theme.id || lightTheme === theme.id
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
            </React.Fragment>
          ))}
          <Divider />
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
          <Divider />
          <Button
            onClick={setThemePrefs}
            value={{ syncSystemTheme: !syncSystemTheme }}
          >
            <Icon icon={syncSystemTheme ? "checkSquare" : "square"} />
            Sync with system (
            <Icon icon={darkSystem ? "moon" : "sun"} noMargin />)
          </Button>
          <Button
            onClick={setThemePrefs}
            value={{ syncRedditTheme: !syncRedditTheme }}
          >
            <Icon icon={syncRedditTheme ? "checkSquare" : "square"} />
            Sync with reddit (
            <Icon icon={redditPrefs.nightmode ? "moon" : "sun"} noMargin />)
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
          <Button
            type="primary"
            href={authURL}
            icon="login"
            label="Login"
            size="large"
          />
        )}
      </>
    );
  }
}

export default connect(
  ({ userPrefs, user, themePrefs, location }) => ({
    userPrefs,
    user,
    themePrefs,
    location,
  }),
  { setUserPrefs, setThemePrefs }
)(PrefMenu);
