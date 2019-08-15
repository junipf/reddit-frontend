import React from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import styled from "styled-components";
import { setUser, setUserPrefs } from "../store/actions";

import UniqueId from "../utils/unique-id";
import SubredditIcon from "./subreddit-icon";
import { Requester } from "./requester";
import { Search, CategoryTitle } from "./dropdown";
import Input from "./input";
import Button from "./button";

export const SubredditEntry = ({ onClick, filter, collapse, ...props }) => {
  return (
    <Button
      to={props.url || props.path}
      onClick={onClick}
      size="fill"
      type="flat"
    >
      <SubredditIcon
        subName={props.display_name}
        size={collapse ? "large" : null}
      />
      {!collapse && (props.curator ? " m/" : " r/") + props.display_name}
    </Button>
  );
};
const FrontpageEntry = ({ onClick }) => (
  <Button
    to="/"
    onClick={onClick}
    size="fill"
    type="flat"
    icon="home"
    label="Frontpage"
  />
);
const PopularEntry = ({ onClick }) => (
  <Button
    to="/r/popular"
    onClick={onClick}
    size="fill"
    type="flat"
    icon="trendingUp"
    label="Popular"
  />
);
const AllEntry = ({ onClick }) => (
  <Button
    to="/r/all"
    onClick={onClick}
    size="fill"
    type="flat"
    icon="barChart2"
    label="All"
  />
);

class SubscriptionList extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      searchResults: [],
      filteredFavorites: [],
      filteredSubscriptions: [],
      filteredMultireddits: [],
      filteredDefaults: [],
    };
    this.handleInput = this.handleInput.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState !== this.state ||
      nextProps.subscriptions !== this.props.subscriptions ||
      nextProps.favorites !== this.props.favorites ||
      nextProps.multireddits !== this.props.multireddits ||
      nextProps.defaults !== this.props.defaults ||
      nextProps.collapse !== this.props.collapse
    );
  }
  handleInput(e) {
    if (this.state.filter !== "") {
      this.context
        .searchSubreddits({ query: e.target.value.toLowerCase().trim() })
        .then((results) => {
          this.setState({ searchResults: this.filterSearch(results) });
        });
    }
    this.setState({ filter: e.target.value.toLowerCase().trim() });
  }
  componentDidUpdate(prevProps, prevState) {
    ReactTooltip.rebuild();

    const {
      filter,
      filteredFavorites,
      filteredSubscriptions,
      filteredMultireddits,
      filteredDefaults,
    } = this.state;
    const { favorites, subscriptions, multireddits, defaults } = this.props;
    const {
      favorites: prevFaves,
      subscriptions: prevSubs,
      multireddits: prevMultis,
      defaults: prevDefaults,
    } = prevProps;

    if (
      filter !== prevState.filter ||
      prevSubs !== subscriptions ||
      prevFaves !== favorites ||
      prevMultis !== multireddits ||
      prevDefaults !== defaults
    ) {
      const newFilteredFavs = this.filterList(favorites, filter);
      const newFilteredSubs = this.filterList(subscriptions, filter);
      const newFilteredMultis = this.filterList(multireddits, filter);
      const newFilteredDefaults = this.filterList(defaults, filter);
      if (
        newFilteredFavs !== filteredFavorites ||
        newFilteredSubs !== filteredSubscriptions ||
        newFilteredMultis !== filteredMultireddits ||
        newFilteredDefaults !== filteredDefaults
      ) {
        this.setState({
          filteredFavorites: newFilteredFavs,
          filteredSubscriptions: newFilteredSubs,
          filteredMultireddits: newFilteredMultis,
        });
      }
    }
  }
  componentDidMount() {
    const { subscriptions, favorites, multireddits, defaults } = this.props;
    const { filter } = this.state;
    this.setState({
      filteredFavorites: this.filterList(favorites, filter),
      filteredSubscriptions: this.filterList(subscriptions, filter),
      filteredMultireddits: this.filterList(multireddits, filter),
      filteredDefaults: this.filterList(defaults, filter),
    });
  }
  filterList = (list, filter) => {
    const { collapse } = this.props;
    if (filter && filter !== "") {
      return list.reduce((filtered, sub) => {
        if (sub && sub.display_name.toLowerCase().includes(filter)) {
          filtered.push(
            <SubredditEntry
              {...sub}
              key={sub.id}
              filter={filter}
              collapse={collapse}
            />
          );
        }
        return filtered;
      }, []);
    }
    return list.map((sub) => (
      <SubredditEntry
        {...sub}
        key={UniqueId(sub.id)}
        filter={filter}
        collapse={collapse}
      />
    ));
  };
  filterSearch = (searchResults) => {
    const { subscriptions, favorites, defaults } = this.props;
    const { collapse, filter } = this.state;
    if (searchResults !== "{}") {
      return searchResults.reduce((filtered, sub) => {
        if (
          sub &&
          subscriptions[sub.display_name] === undefined &&
          favorites[sub.display_name] === undefined &&
          defaults[sub.display_name] === undefined
        ) {
          filtered.push(
            <SubredditEntry
              {...sub}
              key={UniqueId(sub.id)}
              onClick={this.toggleDropdown}
              size="small"
              filter={filter}
              collapse={collapse}
            />
          );
        }
        return filtered;
      }, []);
    } else {
      return null;
    }
  };
  render() {
    const { collapse, user } = this.props;
    const {
      filter,
      filteredFavorites,
      filteredSubscriptions,
      filteredDefaults,
      filteredMultireddits,
      searchResults,
    } = this.state;

    return (
      <ScrollWrapper>
        <Search>
          {collapse ? (
            <Button icon="search" />
          ) : (
            <Input
              placeholder="Search"
              onChange={this.handleInput}
              value={filter}
            />
          )}
        </Search>
        {filter === "" ? (
          <>
            <FrontpageEntry onClick={this.toggleDropdown} key="frontpage" />
            <PopularEntry onClick={this.toggleDropdown} key="popular" />
            <AllEntry onClick={this.toggleDropdown} key="all" />
          </>
        ) : null}
        {filteredFavorites.length > 0 ? (
          <CategoryTitle key="favorites">Favorites</CategoryTitle>
        ) : null}

        {filteredFavorites}
        {!collapse && filteredMultireddits.length > 0 ? (
          <CategoryTitle key="collections">Collections</CategoryTitle>
        ) : null}

        {!collapse && filteredMultireddits}
        {user && !collapse && filteredSubscriptions.length > 0 ? (
          <CategoryTitle key="subscriptions">Subscriptions</CategoryTitle>
        ) : null}
        {!collapse && filteredSubscriptions}
        {!collapse && filteredDefaults.length > 0 ? (
          <CategoryTitle key="defaults">Default Subreddits</CategoryTitle>
        ) : null}
        {!collapse && filteredDefaults}
        {!collapse && searchResults && searchResults.length > 0 ? (
          <CategoryTitle key="searchresults">Search</CategoryTitle>
        ) : null}
        {!collapse && searchResults}
        {!collapse &&
        filteredSubscriptions.length === 0 &&
        filteredFavorites.length === 0 &&
        filteredDefaults.length === 0 &&
        searchResults &&
        searchResults.length === 0 ? (
          <CategoryTitle key="noresults">No results</CategoryTitle>
        ) : null}
      </ScrollWrapper>
    );
  }
}

const ScrollWrapper = styled.div`
  /* max-height: 80vh; */
  min-width: 250px;
  max-height: 100%;
  height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.scrollbar};
  /* padding-bottom: 0.5em; */
`;

const extractSubData = ({
  display_name,
  path,
  url,
  curator,
  community_icon,
  icon_img,
  icon_url,
  primary_color,
  key_color,
  banner_background_color,
  title,
}) => {
  return {
    display_name,
    path,
    url,
    curator,
    community_icon,
    icon_img,
    icon_url,
    primary_color,
    key_color,
    banner_background_color,
    title,
  };
};

function mapStateToProps(state) {
  const {
    subreddits,
    subscriptionNames,
    favoriteNames,
    defaultNames,
    multireddits,
    locationName,
    user,
  } = state;

  let favorites = [];
  let subscriptions = [];
  let defaults = [];

  if (subscriptionNames) {
    subscriptions = subscriptionNames.reduce((subscriptions, name) => {
      if (subreddits[name])
        subscriptions.push(extractSubData(subreddits[name]));
      return subscriptions;
    }, []);
  }

  if (favoriteNames) {
    favorites = favoriteNames.reduce((favorites, name) => {
      if (subreddits[name]) favorites.push(extractSubData(subreddits[name]));
      return favorites;
    }, []);
  }

  if (defaultNames) {
    defaults = defaultNames.reduce((defaults, name) => {
      if (subreddits[name]) defaults.push(extractSubData(subreddits[name]));
      return defaults;
    }, []);
  }

  return {
    subscriptions,
    favorites,
    defaults,
    multireddits,
    locationName,
    user,
  };
}

export default connect(
  mapStateToProps,
  {
    setUser,
    setUserPrefs,
  }
)(SubscriptionList);
