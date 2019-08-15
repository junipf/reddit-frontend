import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import queryString from "query-string";

// Import API-related
import { Requester } from "../components/requester";
import {
  setRefreshToken,
  setUser,
  setUserPrefs,
  setNightmode,
  logout,
  setSubscriptions,
  setMultireddits,
  setDefaults,
} from "../store/actions";
import AppOnlyOAuth from "../utils/app-only-oauth";

// Import pages
import SubscriptionsPage from "./subscriptions-page";
import MessagesPage from "./messages-page";
import ComponentTestPage from "../test";

// Import components
import { SpinnerPage } from "../components/spinner";
import NavigationMenu from "../components/navigation-menu";
import QuickNavigation from "../components/quick-navigation";
import PrefMenu from "../components/pref-menu";
import SplitView from "./split-view";
import TestNav from "../test/test-nav";
import ModTools from "./mod-tools";
import UserPage from "./user-page";

// Import Styles and Fonts
import themes from "../style/themes";
import "normalize.css";
import "@ibm/plex/css/ibm-plex.css";
import GlobalStyle from "../style/global-style";

// Setting up API constants
const snoowrap = require("snoowrap");
if (!process.env.REACT_APP_CLIENT_ID) {
  console.error("No CLIENT_ID environment variable found.");
}
if (!process.env.REACT_APP_REDIRECT_URI) {
  console.error("No REDIRECT_URI environment variable found.");
}
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = "";
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scope = [
  "subscribe",
  "vote",
  "mysubreddits",
  "submit",
  "save",
  "read",
  "privatemessages",
  "report",
  "identity",
  "account",
  "edit",
  "history",
  "flair",
];

class App extends React.Component {
  constructor(props) {
    super(props);
    const { refreshToken } = props;
    this.state = {
      // Creates requester with rehydrated refresh token
      requester: refreshToken
        ? new snoowrap({
            clientId,
            clientSecret,
            refreshToken,
          })
        : null,
      initialized: false,
      noUser: false,
      time: 0,
    };
  }
  componentDidMount() {
    const { refreshToken, history, setRefreshToken } = this.props;

    const values = queryString.parse(document.location.search);

    if (refreshToken === undefined) {
      // Tests to see if we have an authorization code in the URL
      if (values.code) {
        snoowrap
          .fromAuthCode({
            code: values.code,
            clientId,
            redirectUri,
          })
          .then(
            (r) => {
              setRefreshToken(r.refreshToken);
            },
            (error) => {
              console.error(error);
            }
          );
      } else {
        // If we do not have a stored refreshToken (from already logging in)
        // and we do not have a code in the search params, then we authenticate
        // the app itself - i.e. we create a requester without a user logged in.
        // AppOnlyOAuth gives us an accessToken which lasts an hour.
        this.noUserOauth();
      }
    }
    // Restores path to the one we sent to reddit
    if (values.state) {
      history.replace(values.state);
    }
    this.initialize();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidUpdate(prevProps) {
    const { refreshToken } = this.props;
    if (refreshToken && refreshToken !== prevProps.refreshToken) {
      this.setState({
        requester: new snoowrap({
          clientId,
          clientSecret,
          refreshToken,
        }),
      });
    }
    this.initialize();
  }
  initialize = () => {
    if (!this.state.requester || this.state.initialized) return;
    const { requester: r, noUser } = this.state;
    const { setUser, setUserPrefs } = this.props;
    if (process.env.NODE_ENV === "development") r.config({ debug: true });
    if (noUser) {
      r.getDefaultSubreddits().then((subs) => setDefaults(subs));
    } else {
      r.getMe().then((user) => setUser(user));
      r.getPreferences().then((prefs) => setUserPrefs(prefs));
      r.getSubscriptions({ limit: 300 }).then((subscriptions) =>
        setSubscriptions(subscriptions)
      );
      r.getMyMultireddits().then((multis) => setMultireddits(multis));
    }
    this.setState({ initialized: true });
  };
  toggleNightmode = () => {
    this.props.setNightmode(!this.props.useDarkTheme);
  };
  noUserOauth = () => {
    AppOnlyOAuth().then((requester) => {
      this.setState({ requester, noUser: true }, () =>
        console.log(this.state.requester)
      );
      this.interval = setInterval(() => {
        AppOnlyOAuth().then((r) => {
          console.info("updateRequester ran ...");
          const requester = this.state.requester;
          requester.access_token = r.access_token;
          this.setState({ requester }, () => console.log(this.state.requester));
        });
      }, 3540000); //59 minutes
    });
  };
  logout = () => {
    this.props.logout();
    this.noUserOauth();
  };
  render() {
    const { useDarkTheme } = this.props;
    const { requester, noUser } = this.state;
    const pathname = document.location.pathname;
    const theme = useDarkTheme ? themes.dark : themes.light;
    const authURL = snoowrap.getAuthUrl({
      clientId,
      scope,
      redirectUri,
      permanent: true,
      state: pathname,
    });
    if (requester) window.r = requester;

    return (
      <ThemeProvider theme={theme}>
        <div>
          <GlobalStyle />
          {requester ? (
            <Requester.Provider value={requester}>
              <ReactTooltip
                effect="solid"
                place={"bottom"}
                clickable={true}
                delayShow={250}
                className="tooltip"
                type={useDarkTheme ? "light" : "dark"}
              />
              <AppWrapper>
                <Header>
                  <HeaderBase />
                  <HeaderOverlay />
                  <Section>
                    <NavigationMenu />
                    <QuickNavigation />
                    <TestNav />
                  </Section>
                  <Section>{noUser ? "No User Oauth" : ""}</Section>
                  <Section>
                    {/* <Timer /> */}
                    <PrefMenu
                      toggleNightmode={this.toggleNightmode}
                      authURL={authURL}
                      useDarkTheme={useDarkTheme}
                      logout={this.logout}
                      currentThemeName={theme.name}
                    />
                  </Section>
                </Header>
                <Columns>
                  <Switch>
                    <Route path="/mod/:sub?" component={ModTools} />
                    <Route
                      path={[
                        "/user/:username?",
                        "/u/:username?",
                        "/u/me",
                        "/user/me",
                      ]}
                      component={UserPage}
                    />
                    <Route path="/message/:sort?" component={MessagesPage} />
                    <Route
                      exact
                      path="/subscriptions"
                      component={SubscriptionsPage}
                    />
                    <Route
                      path="/test/:subTest?"
                      component={ComponentTestPage}
                    />
                    <Route
                      path={[
                        "/r/:subName/comments/:id/:title/:commentId?",
                        "/r/:subName/:sort?/",
                        "/tb/:id",
                        "/:sort?",
                      ]}
                      component={SplitView}
                    />
                  </Switch>
                </Columns>
              </AppWrapper>
            </Requester.Provider>
          ) : (
            <SpinnerPage />
          )}
        </div>
      </ThemeProvider>
    );
  }
}

const Header = styled.div`
  width: 100vw;
  color: ${({ theme }) => theme.color};
  border-bottom: 1px solid ${({ theme }) => theme.header.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  opacity: 1;
  position: relative;
`;

const HeaderBase = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.header.bg};
`;

const HeaderOverlay = styled(HeaderBase)`
  background-color: ${({ theme }) => theme.header.overlay};
`;

const Section = styled.section`
  display: flex;
  flex-direction: inherit;
  align-items: center;
  height: inherit;
  margin: 0.25rem;
  z-index: 10;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
`;
const Columns = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  flex: 1 1 100%;
  width: 100vw;
`;

function mapStateToProps(state) {
  const { refreshToken, userPrefs } = state;
  let useDarkTheme =
    userPrefs && userPrefs.nightmode ? userPrefs.nightmode : false;
  return { refreshToken, useDarkTheme };
}

const connectedApp = connect(
  mapStateToProps,
  { setRefreshToken, setUserPrefs, setUser, setNightmode, logout }
)(App);

export default (process.env.NODE_ENV === "development"
  ? hot(module)(connectedApp)
  : connectedApp);
