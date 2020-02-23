import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
  Fragment,
  useRef,
} from "react";
import { connect } from "react-redux";
import { setSubscriptions, setDefaults } from "./../store/actions";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";

import UniqueId from "../utils/unique-id";
import SubredditIcon from "./subreddit-icon";
import { Requester } from "./requester";
import { Search, CategoryTitle } from "./dropdown";
import Input from "./input";
import Button from "./button";
import BasicNavigation from "./basic-navigation";
import { Spinner } from "./spinner";
import useIntersect from "../utils/use-intersect";

const HighlightSpan = ({ string, highlight, prefix = "" }) => {
  if (
    !highlight ||
    !string ||
    highlight === "" ||
    string.toLowerCase().indexOf(highlight.toLowerCase()) === -1
  )
    return <span>{prefix + string}</span>;

  // const regex = new RegExp(highlight, "g");

  // const parts = string.matchAll(regex);

  // if (parts.length > 0) console.log(parts[0], parts[1]);

  return (
    <span>
      {prefix}
      {string.slice(0, string.toLowerCase().indexOf(highlight))}
      <Highlight>
        {string.slice(
          string.toLowerCase().indexOf(highlight),
          string.toLowerCase().indexOf(highlight) + highlight.length
        )}
      </Highlight>
      {string.slice(string.toLowerCase().indexOf(highlight) + highlight.length)}
      {/* <hr /> */}
      {/* {parts.join(" ")} */}
    </span>
  );
};

export const SubredditEntry = ({
  onClick,
  filter,
  sub,
  sub: {
    display_name: subName,
    public_description: description,
    curator,
    url,
    path,
    title,
  },
  page,
  ...props
}) => (
  <>
    <Button
      to={url || path}
      onClick={onClick}
      size={page ? "large" : null}
      fill={!page}
      flat
      data-tip={title}
      data-place="right"
    >
      <SubredditIcon sub={sub} size="small" />
      <HighlightSpan
        highlight={filter}
        string={subName}
        prefix={!!curator ? "m/" : "r/"}
      />
    </Button>
    {/* <HighlightSpan highlight={filter} string={description} /> */}
  </>
);

// const BasicEntries = () => (
//   <>
//     <Button to="/" fill flat icon="home" label="Frontpage" />
//     <Button
//       to="/r/popular"
//       fill
//       flat
//       icon="trendingUp"
//       label="Popular"
//     />
//     <Button to="/r/all" fill flat icon="barChart2" label="All" />
//   </>
// );

const SubscriptionList = ({
  // favorites,
  multireddits,
  defaults,
  subscriptions,
  setSubscriptions,
  setDefaults,
}) => {
  const r = useContext(Requester);
  const [filter, setFilter] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleInput = (e) =>
    setFilter(e.target.value.toLowerCase().trim() || "");

  /* --> TODO <-- */
  // - Cache results per letter
  // - Set timeout before fetching results
  // - Support "r/" for subreddit name search

  const filterList = useCallback(
    (list) => {
      if (filter && filter !== "") {
        return list.reduce((filtered, sub) => {
          if (sub && sub.display_name.toLowerCase().includes(filter)) {
            filtered.push(sub);
          }
          return filtered;
        }, []);
      }
      return list;
    },
    [filter]
  );

  const filteredFavorites = useMemo(() => {
    const favorites = subscriptions.filter((sub) => sub.user_has_favorited);
    // console.log("favorites", favorites);
    return filterList(favorites, filter);
  }, [subscriptions, filterList, filter]);

  const filteredSubscriptions = useMemo(
    () => filterList(subscriptions, filter),
    [subscriptions, filterList, filter]
  );
  const filteredMultireddits = useMemo(() => filterList(multireddits, filter), [
    multireddits,
    filterList,
    filter,
  ]);
  const filteredDefaults = useMemo(() => filterList(defaults, filter), [
    defaults,
    filterList,
    filter,
  ]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter !== "") {
        r.searchSubreddits({ query: filter }).then((results) => {
          setSearchResults(results);
        });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [r, filter]);

  const $scrollWrapper = useRef(null);

  const [last, setLast] = useState(null);

  useEffect(() => {
    setLast(
      searchResults && searchResults.isFinished === false
        ? { listing: searchResults, dispatch: setSearchResults }
        : defaults && defaults.isFinished === false
        ? { listing: defaults, dispatch: setDefaults }
        : subscriptions && subscriptions.isFinished === false
        ? { listing: subscriptions, dispatch: setSubscriptions }
        : null
    );
  }, [searchResults, defaults, subscriptions, setDefaults, setSubscriptions]);

  const [fetchingMore, setFetchingMore] = useState(false);

  const fetchMore = useCallback(() => {
    if (fetchingMore) return;
    if (last) {
      setFetchingMore(true);

      last.listing.fetchMore({ amount: 25 }).then((result) => {
        setFetchingMore(false);
        last.dispatch(result);
      });
    }
  }, [fetchingMore, last]);

  return (
    <>
      <Search>
        <Input placeholder="Search" onChange={handleInput} value={filter} />
      </Search>
      <ScrollWrapper ref={$scrollWrapper}>
        {filter === "" ? <BasicNavigation inList /> : null}
        {[
          { name: "Favorites", list: filteredFavorites },
          { name: "Collections", list: filteredMultireddits },
          { name: "Default subreddits", list: filteredDefaults },
          { name: "Subscriptions", list: filteredSubscriptions },
          { name: "Search results", list: searchResults },
        ].map(({ list, name, unfiltered }) =>
          list ? (
            <Fragment key={name}>
              {list.length > 0 ? (
                <CategoryTitle key={name}>
                  {name} [{list.length}]
                </CategoryTitle>
              ) : null}
              {list.map((sub) =>
                sub ? (
                  <SubredditEntry
                    sub={sub}
                    key={UniqueId(sub.id)}
                    size="small"
                    filter={filter}
                  />
                ) : null
              )}
            </Fragment>
          ) : null
        )}
        {filteredSubscriptions.length === 0 &&
        filteredFavorites.length === 0 &&
        filteredDefaults.length === 0 &&
        searchResults &&
        searchResults.length === 0 ? (
          <CategoryTitle key="noResults">No results</CategoryTitle>
        ) : null}
        <LoadMoreSpinner
          fetchingMore={fetchingMore}
          enabled={
            (searchResults && !searchResults.isFinished) ||
            (defaults && !defaults.isFinished) ||
            (subscriptions && !subscriptions.isFinished)
          }
          onIntersect={fetchMore}
          parent={$scrollWrapper}
        />
      </ScrollWrapper>
    </>
  );
};

const LoadMoreSpinner = ({ onIntersect, parent, fetchingMore, enabled }) => {
  const [$spinner, entry] = useIntersect({
    root: parent.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry.intersectionRatio > 0.1 && !fetchingMore && enabled) {
      onIntersect();
    }
    return onIntersect();
  }, [entry, onIntersect, fetchingMore, enabled]);

  return <Spinner forwardRef={$spinner} />;
};

const Highlight = styled.span`
  background-color: ${({ theme }) => theme.highlight};
`;

const ScrollWrapper = styled.div`
  min-width: 250px;
  max-height: ${({ page }) => (page ? null : "30rem")};
  height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  overflow: ${({ page }) => (page ? "visible" : null)};
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.scrollbar};
`;

export default connect(
  ({ subscriptions, defaults, multireddits, user }) => {
    return {
      subscriptions,
      defaults,
      multireddits,
      user,
    };
  },
  {
    setSubscriptions,
    setDefaults,
  }
)(SubscriptionList);
