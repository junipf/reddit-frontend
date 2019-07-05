import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
// import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import queryString from "query-string";

// Import API-related
import { Requester } from "../components/requester";
import { setRefreshToken, setUser, setUserPrefs } from "../store/actions";

// Import containers and components
import PostListing from "./post-listing";
import CommentListing from "./comment-listing";
import SubscriptionsPage from "./subscriptions-page";
import MessagesPage from "./messages-page";
import { ComponentTestPage } from "../test/test-pages";
import Button from "../components/button";
import { Spinner } from "../components/spinner";
import NavigationMenu from "../components/navigation-menu";
import PrefMenu from "../components/pref-menu";

// Import Styles and Fonts
import { themes } from "../style/color-theme";
import "normalize.css";
import "@ibm/plex/css/ibm-plex.css";
import SubscriptionList from "../components/subscription-list";
import { Sidebar } from "./column";
import { QuickNavigation } from "../components/quick-navigation";

// Global Style
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeSpeed;
    word-wrap: break-word;
    box-sizing: border-box;
    margin: 0;
  }
  
  :root,
  html,
  body,
  #root,
  .app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  a {
  text-decoration: none;
  }
  
  * {
  box-sizing: inherit;
  }

  svg {
    color: inherit;
  }

  html {
    scroll-behavior: smooth;
  }
  
  /* react-tooltip */
  .tooltip {
  .multi-line {
    text-align: left !important;
    &:first-child {
      font-size: 0.9rem;
    }
    &:not(:first-child) {
      font-size: 0.75rem;
      font-style: italic;
      }
    }
  }
  /* Markdown bodies returned from reddit */
  .md {
    p {
      margin: 0.25em 0;
    }
    blockquote {
      margin: 0.5em;
      border-left: 0.25em solid grey;
      & > p {
        margin {
          margin: 0.25em 0.25em;
        }
      }
    }
  }
`;

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
  "creddits",
  "modcontributors",
  "modmail",
  "modconfig",
  "subscribe",
  "structuredstyles",
  "vote",
  "wikiedit",
  "mysubreddits",
  "submit",
  "modlog",
  "modposts",
  "modflair",
  "save",
  "modothers",
  "read",
  "privatemessages",
  "report",
  "identity",
  "livemanage",
  "account",
  "modtraffic",
  "wikiread",
  "edit",
  "modwiki",
  "modself",
  "history",
  "flair",
];

function LoginPrompt({ state }) {
  let authURL = snoowrap.getAuthUrl({
    clientId,
    scope,
    redirectUri,
    permanent: true,
    state,
  });
  return (
    <Wrapper>
      <p>
        <Button
          type="primary"
          href={authURL}
          icon="login"
          label="Log in with Reddit"
          size="large"
        />
      </p>
      <p>
        Your credentials will be saved locally and never transmitted other than
        to reddit's auth servers.
      </p>
      <p>
        We don't watch you in any way - nothing about you is transmitted
        anywhere but reddit's servers, and we minimize even what we tell them.
      </p>
      <p>
        We won't subscribe you anywhere, upvote anything, or do anything at all,
        without your explicit input.
      </p>
      <p>
        We're completely open source! <Button
          icon="github"
          to="https://github.com/junipf/reddit-frontend"
          label="View on Github"
        />
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 10rem;
  display: flex;
  align-content: center;
  flex-flow: column nowrap;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    const { refreshToken } = props;
    this.state = {
      // Creates requester with rehydrated token
      requester: refreshToken
        ? new snoowrap({
            clientId,
            clientSecret,
            refreshToken,
          })
        : null,
      initialized: false,
      collapse: true,
    };
  }
  componentDidMount() {
    const { refreshToken, location, history, setRefreshToken } = this.props;
    // if (this.state.requester !== null)
    //   console.info("Requester created as:", this.state.requester);

    const values = queryString.parse(location.search);

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
            r => {
              setRefreshToken(r.refreshToken);
            },
            error => {
              console.error(error);
            }
          );
      }
    }
    // Restores path to the one we sent to reddit
    if (values.state) {
      history.replace(values.state);
    }
    this.initialize();
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
    const r = this.state.requester;
    const { setUser, setUserPrefs } = this.props;
    r.config({ debug: true });
    r.getMe().then(user => setUser(user));
    r.getPreferences().then(prefs => {
      setUserPrefs(prefs);
    });
    this.setState({ initialized: true });
  };
  toggleSubscriptionList = () => {
    this.setState({ collapse: !this.state.collapse });
  };
  render() {
    const { refreshToken, location, useDarkTheme } = this.props;
    const { requester, collapse } = this.state;
    const theme = useDarkTheme ? themes.dark : themes.light;
    return (
      <ThemeProvider theme={theme}>
        <div>
          <GlobalStyle />
          {refreshToken === undefined ? (
            <LoginPrompt state={location.pathname} />
          ) : requester ? (
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
                  <Section>
                    <NavigationMenu />
                  </Section>
                  <Section>
                    <PrefMenu />
                  </Section>
                </Header>
                <Columns>
                  <Sidebar collapse={collapse}>
                    <Button
                      label="Collapse"
                      onClick={this.toggleSubscriptionList}
                    />
                    {collapse ? (
                      <QuickNavigation />
                    ) : (
                      <SubscriptionList collapse={collapse} />
                    )}
                  </Sidebar>
                  <Switch>
                    <Route path="/message/:sort?" component={MessagesPage} />
                    <Route
                      exact
                      path="/subscriptions"
                      component={SubscriptionsPage}
                    />
                    <Route exact path="/test" component={ComponentTestPage} />
                    <Route
                      path={[
                        "/r/:subredditName/comments/:id/:title/:commentId?",
                        "/r/:subredditName/:sort?/",
                        "/:sort?",
                      ]}
                      component={SplitListings}
                    />
                  </Switch>
                </Columns>
              </AppWrapper>
            </Requester.Provider>
          ) : (
            <Spinner />
          )}
        </div>
      </ThemeProvider>
    );
  }
}

const headerHeight = "calc(3rem - 1px)";

const Header = styled.div`
  width: 100vw;
  height: ${headerHeight};
  background-color: ${props => props.theme.container.levels[1]};
  color: ${props => props.theme.container.color};
  border-bottom: 1px solid ${props => props.theme.container.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Section = styled.div`
  display: flex;
  flex-direction: inherit;
  align-items: center;
  height: inherit;
  margin: 0.25rem;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;
const Columns = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: calc(100vh - ${headerHeight} + 1px);
  width: 100vw;
`;

const SplitListings = props => {
  return (
    <>
      <Route
        path={["/r/:subredditName/:sort?/:id?", "/:sort?/:id?"]}
        component={PostListing}
      />
      <Route
        path="/r/:subredditName/comments/:id/:title/:commentId?"
        component={CommentListing}
      />
    </>
  );
};

function mapStateToProps(state) {
  const { refreshToken, userPrefs } = state;
  let useDarkTheme =
    userPrefs && userPrefs.nightmode ? userPrefs.nightmode : false;
  return { refreshToken, useDarkTheme };
}

export default connect(
  mapStateToProps,
  { setRefreshToken, setUserPrefs, setUser }
)(App);
// )(hot(module)(App));
