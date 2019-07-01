import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import queryString from "query-string";

// Import API-related
import { Requester } from "../components/requester";
import { setRefreshToken } from "../store/actions";

// Import containers and components
import PostListing from "./post-listing";
import CommentListing from "./comment-listing";
import SubscriptionsPage from "./subscriptions-page";
import MessagesPage from "./messages-page";
import Header from "./header";
import { ComponentTestPage } from "../test/test-pages";
import Button from "../components/button";
import { Spinner } from "../components/spinner";

// Import Styles and Fonts
import { themes } from "../style/color-theme";
import "normalize.css";
import "@ibm/plex/scss/ibm-plex.scss";

// Global Style
const GlobalStyle = createGlobalStyle`
  @import "node_modules/@ibm/plex/scss/ibm-plex.scss";
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
      <Button
        type="primary"
        href={authURL}
        icon="login"
        label="Log in with Reddit"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 1rem auto;
  width: 100vw;
  display: flex;
  justify-content: center;
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
    };
    this.state.requester.config({ debug: true });
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
    this.state.requester.config({ debug: true });
  }
  render() {
    const { refreshToken, location, darkTheme } = this.props;
    const { requester } = this.state;
    if (refreshToken === undefined)
      return <LoginPrompt state={location.pathname} />;
    if (requester) {
      return (
        <ThemeProvider theme={darkTheme ? themes.dark : themes.light}>
          <Requester.Provider value={requester}>
            <GlobalStyle />
            <ReactTooltip
              effect="solid"
              place={"bottom"}
              clickable={true}
              delayShow={250}
              className="tooltip"
              type={darkTheme ? "light" : "dark"}
            />
            <AppWrapper>
              <Header
                toggleDarkTheme={this.toggleDarkTheme}
                darkTheme={darkTheme}
              />
              <Columns>
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
        </ThemeProvider>
      );
    }
    return <Spinner />;
  }
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;
const Columns = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: calc(100vh - 3rem + 1px);
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
    // <>
    //   <PostListing {...props} />
    //   <CommentListing {...props} />
    // </>
  );
};

function mapStateToProps(state) {
  const { refreshToken, userPrefs } = state;
  return { refreshToken, darkTheme: userPrefs.nightmode };
}

export default connect(
  mapStateToProps,
  { setRefreshToken }
  // )(hot(module)(App));
)(hot(module)(App));
