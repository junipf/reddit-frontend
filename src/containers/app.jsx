import { hot } from "react-hot-loader";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import styled, { ThemeProvider } from "styled-components";

import Button from "../components/button";
import queryString from "query-string";

import { Requester } from "../components/requester";
import { setRefreshToken } from "../store/actions";
import { themes } from "../style/color-theme";

// import CommentListing from "./CommentListing";
import PostListing from "./post-listing";
import SubscriptionsPage from "./subscriptions-page";
import MessagesPage from "./messages-page";
import Header from "./header";
import { ComponentTestPage } from "../test/test-pages";

import { Spinner } from "../components/spinner";

const snoowrap = require("snoowrap");
const clientId = "f6izM-6-3NbhKQ";
const clientSecret = "";
const redirectUri = "http://localhost:3000/";
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
      darkTheme: false,
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
              console.log(error);
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
      // console.log("Got new refresh token");
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
  toggleDarkTheme = () => {
    this.setState({ darkTheme: !this.state.darkTheme });
  };
  render() {
    const { refreshToken, location } = this.props;
    const { darkTheme, requester } = this.state;
    if (refreshToken === undefined)
      return <LoginPrompt state={location.pathname} />;
    if (requester) {
      return (
        <ThemeProvider theme={darkTheme ? themes.dark : themes.light}>
          <Requester.Provider value={requester}>
            <ReactTooltip
              effect="solid"
              place={"bottom"}
              clickable={true}
              delayShow={250}
              className="tooltip"
              type={darkTheme ? "light" : "dark"}
            />
            <AppWrapper>
              <Columns>
                <Header
                  toggleDarkTheme={this.toggleDarkTheme}
                  darkTheme={darkTheme}
                />
                <Switch>
                  <Route path="/message/:sort?" component={MessagesPage} />
                  <Route
                    exact
                    path="/subscriptions"
                    component={SubscriptionsPage}
                  />
                  <Route exact path="/test" component={ComponentTestPage} />
                  <Route exact path="/:sort?" component={PostListing} />
                  <Route
                    path="/r/:subredditName/:sort?/:id?/:title?"
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
  flex-flow: row nowrap;
`;
const Columns = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
  width: 100vw;
`;

const SplitListings = props => {
  return (
    <>
      <PostListing {...props} />
      {/* <CommentListing {...props}/> */}
    </>
  );
};

function mapStateToProps(state) {
  const { refreshToken } = state;
  return { refreshToken };
}

export default connect(
  mapStateToProps,
  { setRefreshToken }
  // )(hot(module)(App));
)(hot(module)(App));
