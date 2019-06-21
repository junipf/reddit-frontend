import React from "react";

import { connect } from "react-redux";

import SubredditCard from "../components/subreddit-card";
import { Spinner } from "../components/spinner";
import { addSubreddit } from "../store/actions";
import { Requester } from "../components/requester";
class SubscriptionsPage extends React.Component {
  static contextType = Requester;
  componentDidMount() {
    const { subredditsToFetch, addSubreddit } = this.props;
    if (subredditsToFetch.length > 0) {
      // eslint-disable-next-line array-callback-return
      subredditsToFetch.map(name => {
        this.context
          .getSubreddit(name)
          .refresh()
          .then(subreddit => addSubreddit(subreddit));
      });
    }
  }
  render() {
    const { subscriptions, subredditsToFetch } = this.props;
    return (
      <div className="column subscriptions-page">
        {subredditsToFetch.length > 0 ? <Spinner /> : null}
        {subscriptions.map(sub => (
          <SubredditCard {...sub} key={sub.id} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { subreddits, subscriptionNames, favoriteNames, multireddits } = state;

  let favorites = [];
  let subscriptions = [];
  let subredditsToFetch = [];
  if (subscriptionNames) {
    // subscriptions = subscriptionNames.map(name => subreddits[name]);
    subscriptions = subscriptionNames.reduce((filtered, name) => {
      if (subreddits[name]) filtered.push(subreddits[name]);
      else subredditsToFetch.push(name);
      return filtered;
    }, []);
  }
  if (favoriteNames) {
    favorites = favoriteNames.map(name => subreddits[name]);
  }
  return {
    subscriptions,
    favorites,
    multireddits,
    subredditsToFetch,
  };
}

export default connect(
  mapStateToProps,
  { addSubreddit }
)(SubscriptionsPage);
