import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import {
  setSubscriptions,
  setMultireddits,
  setUser,
  setUserPrefs,
} from "../store/actions";

import UniqueId from "../utils/unique-id";
// import Button from "./button";
import SubredditIcon from "./subreddit-icon";
import { Requester } from "./requester";
import Icon from "./icon";
import Dropdown, { LinkEntry, Search, Input, CategoryTitle } from "./dropdown";
import { ScrollWrapper } from "./../containers/scroll-wrapper";
import { QuickNavigation } from "../components/quick-navigation";

import { ReactComponent as Popular } from "../icons/trending-up.svg";
import { ReactComponent as All } from "../icons/bar-chart-2.svg";
import { ReactComponent as Home } from "../icons/home.svg";

const EntrySubIcon = styled(SubredditIcon)`
  margin-right: 0.5em;
`;

export const SubredditEntry = ({ onClick, ...props }) => (
  <LinkEntry to={props.url || props.path} onClick={onClick}>
    <EntrySubIcon {...props} />
    {props.curator ? " m/" : " r/" + props.display_name}
  </LinkEntry>
);
const FrontpageEntry = ({ onClick }) => (
  <LinkEntry to="/" onClick={onClick}>
    <Home />
    Frontpage
  </LinkEntry>
);
const PopularEntry = ({ onClick }) => (
  <LinkEntry to="/r/popular" onClick={onClick}>
    <Popular />
    Popular
  </LinkEntry>
);
const AllEntry = ({ onClick }) => (
  <LinkEntry to="/r/all" onClick={onClick}>
    <All />
    All
  </LinkEntry>
);

class NavigationMenu extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      searchResults: [],
    };
    this.handleInput = this.handleInput.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState !== this.state ||
      nextProps.subscriptions !== this.props.subscriptions ||
      nextProps.favorites !== this.props.favorites ||
      nextProps.multireddits !== this.props.multireddits
    );
  }
  handleInput(e) {
    if (this.state.filter !== "") {
      this.context
        .searchSubreddits({ query: e.target.value.toLowerCase().trim() })
        .then(results => this.setState({ searchResults: results }));
    }
    this.setState({ filter: e.target.value.toLowerCase().trim() });
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  componentDidMount() {
    const {
      subscriptions,
      multireddits,
      setSubscriptions,
      setMultireddits,
    } = this.props;
    const r = this.context;
    if (subscriptions.length === 0) {
      r.getSubscriptions({ limit: 1000 }).then(subscriptions => {
        setSubscriptions(subscriptions);
      });
    }
    if (multireddits.length === 0) {
      r.getMyMultireddits().then(multis => {
        setMultireddits(multis);
      });
    }
  }
  filterList = (list, filter) => {
    if (filter && filter !== "") {
      return list.reduce((filtered, sub) => {
        if (sub && sub.display_name.toLowerCase().includes(filter)) {
          filtered.push(<SubredditEntry {...sub} key={sub.id} />);
        }
        return filtered;
      }, []);
    }
    return list.map(sub => <SubredditEntry {...sub} key={UniqueId(sub.id)} />);
  };
  render() {
    const {
      subscriptions,
      favorites,
      multireddits,
      locationName,
    } = this.props;
    const { filter, searchResults } = this.state;    

    const filteredFavorites = this.filterList(favorites, filter);
    const filteredSubscriptions = this.filterList(subscriptions, filter);
    const filteredMultireddits = this.filterList(multireddits, filter);

    let filteredSearchResults = [];
    //Search result returns "{}" when no filter given.
    if (searchResults !== "{}") {
      filteredSearchResults = searchResults.reduce((filtered, sub) => {
        if (
          sub &&
          subscriptions[sub.display_name] === undefined &&
          favorites[sub.display_name] === undefined
        ) {
          filtered.push(
            <SubredditEntry
              {...sub}
              key={UniqueId(sub.id)}
              onClick={this.toggleDropdown}
            />
          );
        }
        return filtered;
      }, []);
    }

    return (
      <NavMenu>
        <Dropdown
          icon="menu"
          label={locationName}
        >
          <Search>
            <Input
              placeholder="Search"
              onChange={this.handleInput}
              value={filter}
            />
          </Search>
          <ScrollWrapper>
            {filter === "" ? (
              <>
                <FrontpageEntry onClick={this.toggleDropdown} key="frontpage" />
                <PopularEntry onClick={this.toggleDropdown} key="popular" />
                <AllEntry onClick={this.toggleDropdown} key="all" />
              </>
            ) : null}
            {filteredFavorites.length > 0 ? (
              <CategoryTitle key="favorites">
                Favorites
                <Icon icon="info" label="Subreddits you have favorited" />
              </CategoryTitle>
            ) : null}

            {filteredFavorites}
            {filteredMultireddits.length > 0 ? (
              <CategoryTitle key="collections">
                Collections
                <Icon icon="info" label="Your collections" />
              </CategoryTitle>
            ) : null}

            {filteredMultireddits}
            {filteredSubscriptions.length > 0 ? (
              <CategoryTitle key="subscriptions">
                Subscriptions
                <Icon icon="info" label="Your subscriptions" />
              </CategoryTitle>
            ) : null}
            {filteredSubscriptions}
            {filteredSearchResults.length > 0 ? (
              <CategoryTitle key="searchresults">
                Search
                <Icon
                  icon="info"
                  label="Search results returned from reddit. These "
                />
              </CategoryTitle>
            ) : null}
            {filteredSearchResults}
            {filteredSubscriptions.length === 0 &&
            filteredFavorites.length === 0 &&
            filteredSearchResults.length === 0 ? (
              <CategoryTitle key="noresults">
                No results
                <Icon
                  icon="info"
                  data-tip="No results found from reddit's search - did you mistype something?"
                />
              </CategoryTitle>
            ) : null}
          </ScrollWrapper>
        </Dropdown>
        <QuickNavigation favorites={this.props.favorites} />
      </NavMenu>
    );
  }
}

const NavMenu = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
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
  const { subreddits, subscriptionNames, favoriteNames, multireddits, locationName } = state;

  let favorites = [];
  let subscriptions = [];

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

  return {
    subscriptions,
    favorites,
    multireddits,
    locationName,
  };
}

export default connect(
  mapStateToProps,
  {
    setSubscriptions,
    setMultireddits,
    setUser,
    setUserPrefs,
  }
)(NavigationMenu);
