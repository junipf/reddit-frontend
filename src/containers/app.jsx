import React from "react";
import styled from "styled-components";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import queryString from "query-string";

// Import API-related
import { Requester } from "../components/requester";
import {
  setRefreshToken,
  setUser,
  setUserPrefs,
  logout,
  setSubscriptions,
  setMultireddits,
  setDefaults,
} from "../store/actions";
import AppOnlyOAuth from "../utils/app-only-oauth";

// Import pages;
import ComponentTestPage from "../test";

// Import components
import { SpinnerPage } from "../components/spinner";
// import Listing from "./uni-listing";
import SplitView from "./split-view";
// import Thread from "./thread";
import Header from "./header";

// Import Styles and Fonts
import "normalize.css";
import "@ibm/plex/css/ibm-plex.css";
import GlobalStyle from "../style/global-style";
import GlobalThemeProvider from "../style/global-theme-provider";

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

// Routes

const sort = ":sort(hot||best||new||rising||controversial||top)";
const searchSort = ":sort(relevance||new||comments||top)";

export const routes = {
  thread: "/r/:subName/comments/:id/:title/:commentId?",
  listing: [
    "/r/:subName/comments/:id/:title/:commentId?",
    `/r/:subName/${sort}?`,
    "/tb/:id",
    `/${sort}`,
  ],
  search: [
    `/r/:subName/:type(search)/${searchSort}?`,
    `/:type(search)${searchSort}?`,
  ],
  user: [
    `/u/:username/:type?/:multi?/`,
    `/user/:username/:type?/:multi?/${sort}?`,
    `/user/:username/:type?/:multi?`,
  ],
  // uni: `/:listing(r||u||user)/:name/:type?`
};

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
    const {
      setUser,
      setUserPrefs,
      setDefaults,
      setMultireddits,
      setSubscriptions,
    } = this.props;
    if (process.env.NODE_ENV === "development") r.config({ debug: true });
    if (noUser) {
      r.getDefaultSubreddits().then((subs) => {
        // console.log(subs);
        setDefaults(subs);
      });
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
  noUserOauth = () => {
    AppOnlyOAuth().then((requester) => {
      this.setState({ requester, noUser: true });
      this.interval = setInterval(() => {
        AppOnlyOAuth().then((r) => {
          console.info("updateRequester ran ...");
          const requester = this.state.requester;
          requester.access_token = r.access_token;
          this.setState({ requester });
        });
      }, 3540000); //59 minutes
    });
  };
  logout = () => {
    this.props.logout();
    this.noUserOauth();
  };
  render() {
    const { requester } = this.state;
    const pathname = document.location.pathname;
    const authURL = snoowrap.getAuthUrl({
      clientId,
      scope,
      redirectUri,
      permanent: true,
      state: pathname,
    });
    if (requester) window.r = requester;

    if (!this.state.initialized) return <SpinnerPage />;

    return (
      <GlobalThemeProvider>
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
              />
              <AppWrapper>
                <Header authURL={authURL} logout={this.logout} />
                <Columns>
                  <Switch>
                    <Redirect from="/u/:username" to="/user/:username" />
                    <Route
                      path="/test/:subTest?"
                      component={ComponentTestPage}
                    />
                    <Route
                      path={[
                        ...routes.listing,
                        ...routes.user,
                        ...routes.search,
                        ...routes.thread,
                      ]}
                      // component={Listing}
                      component={SplitView}
                    />
                  </Switch>
                  {/* <Route path={routes.thread} component={Thread} /> */}
                </Columns>
              </AppWrapper>
            </Requester.Provider>
          ) : (
            <SpinnerPage />
          )}
        </div>
      </GlobalThemeProvider>
    );
  }
}

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

const connectedApp = connect(
  ({ refreshToken }) => ({
    refreshToken,
  }),
  {
    setRefreshToken,
    setUserPrefs,
    setUser,
    logout,
    setSubscriptions,
    setMultireddits,
    setDefaults,
  }
)(App);

export default process.env.NODE_ENV === "development"
  ? hot(module)(connectedApp)
  : connectedApp;
