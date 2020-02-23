import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setLocation } from "../store/actions";
import { Link } from "react-router-dom";
import { Requester } from "../components/requester";
import ReactTooltip from "react-tooltip";

import Column from "./column";
import Error from "../components/error";
import Icon from "../components/icon";
import { UserCard, MultiCard, SearchCard } from "../components/info-card";
import SubredditBanner from "../components/subreddit-banner";
import { SpinnerPage } from "../components/spinner";
import { map, getMode } from "./settings";
import SubredditThemeProvider from "../style/sub-theme-provider";

import MixedListing from "./mixed-listing";

const StyledPermalink = styled.span`
  font-size: 0.8em;
  height: 1em;
  display: inline-block;
  font-style: italic;
  margin-top: 0.5em;
  a {
    color: ${({ theme }) => theme.link};
  }
`;

export const Center = styled.span`
  padding: 0.5rem;
  text-align: center;
  display: block;
`;

export const PostLine = styled.div`
  font-size: 0.75rem;
  /* margin: 0.25rem; */
  /* background: ${({ theme }) => theme.card.innerBg}; */
  border-bottom: 1px solid ${({ theme }) => theme.card.innerBorder};
  padding: 0.5rem;
  margin: -0.65rem;
  & a {
    color: ${({ theme }) => theme.link};
  }
`;

export const Permalink = ({ to }) => (
  <StyledPermalink>
    <Link to={to}>
      View Comment <Icon inline icon="externalLink" />
    </Link>
  </StyledPermalink>
);

const Page = ({
  history,
  match: { params: path } = {},
  location,
  setLocation,
  loggedIn,
  ...props
}) => {
  const [error, setError] = useState(null);
  // Fetch user-specific non-listing data
  useEffect(() => {
    if (path.username === "me")
      if (loggedIn) history.replace(`/user/${loggedIn}`);
      else
        setError({
          e: {
            message: "You are not logged in, so we can't redirect from u/me",
          },
        });
  }, [path.username, history, loggedIn]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <Column>
      {error ? (
        <Error {...error} />
      ) : path.username === "me" ? (
        <SpinnerPage />
      ) : (
        <Listing path={path} location={location} />
      )}
    </Column>
  );
};

const Listing = ({ path, location, loggedIn }) => {
  const r = useContext(Requester);
  const [fetched, setFetched] = useState({
    listing: [],
    type: null,
    options: {},
  });

  const [error, setError] = useState(null);

  const fetch = useCallback(
    (
      options,
      {
        mode,
        type,
        username,
        subName,
        multi,
        sort,
        time,
        query,
        nsfw,
        quarantine,
      }
    ) => {
      console.info("MODE:", mode, "TYPE:", type);
      const success = ({ listing, m, sub, user }) => {
        console.log(mode, listing);
        setFetched({
          listing,
          options,
          m,
          sub,
          user,
        });
      };

      const fail = (e) =>
        setError({ e, type, name: username || subName || multi });
      if (
        !fetched.listing._method ||
        fetched.options.username !== username ||
        fetched.options.sort !== sort ||
        fetched.options.t !== time ||
        fetched.options.multi !== multi ||
        fetched.options.query !== query ||
        fetched.options.nsfw !== nsfw ||
        fetched.options.subName !== subName ||
        fetched.options.mode !== mode
      ) {
        console.info("UniListing fetching new listing with options:", options);
        switch (mode) {
          case "search":
            const search = {
              query,
              sort,
              t: time,
              subreddit: subName,
              nsfw,
              quarantine,
              restrictSr: !!subName,
              syntax: "play",
            };
            if (subName) {
              r.getSubreddit(subName)
                .fetch()
                .then((sub) => {
                  sub
                    .search(search)
                    .then((listing) => success({ listing, sub }))
                    .catch((e) => {
                      setError({ type: "search", name: `"${query}"`, e });
                    });
                });
            } else {
              r.search(search)
                .then((listing) => success({ listing }))
                .catch((e) => {
                  setError({ type: "search", name: `"${query}"`, e });
                });
            }
            break;
          case "multi":
            r.getUser(username)
              .fetch()
              .getMultireddits()
              .then((multireddits) =>
                multireddits.forEach((m) => {
                  let subNames = "";
                  if (m.name === multi)
                    m.subreddits.forEach((subs) => {
                      subNames = subNames + "+" + subs.display_name;
                    });
                  if (subNames !== "")
                    r._getSortedFrontpage(sort, subNames, {
                      time,
                    })
                      .then((listing) => success({ listing, m }), fail)
                      .catch((e) => {
                        setError({
                          name: `m/${multi}`,
                          e,
                          type: "multireddit",
                        });
                      });
                })
              );
            break;
          case "user":
          case "userLoggedIn":
            const user = r.getUser(username);
            switch (type) {
              case "posts":
                user
                  .getSubmissions(options)
                  .then((listing) => success({ listing }), fail);
                break;
              case "saved":
                user
                  .getSavedContent(options)
                  .then((listing) => success({ listing }), fail);
                break;
              case "hidden":
                user
                  .getHiddenContent(options)
                  .then((listing) => success({ listing }), fail);
                break;
              case "upvoted":
                user
                  .getUpvotedContent(options)
                  .then((listing) => success({ listing }), fail);
                break;
              case "downvoted":
                user
                  .getDownvotedContent(options)
                  .then((listing) => success({ listing }), fail);
                break;
              case "comments":
                user
                  .getComments(options)
                  .then((listing) => success({ listing }), fail);
                break;
              default:
                user
                  .getOverview(options)
                  .then((listing) => success({ listing }), fail);
            }
            break;
          case "subreddit":
            r.getSubreddit(subName)
              .fetch()
              .then((sub) => {
                r._getSortedFrontpage(sort, subName, {
                  t: time,
                }).then((listing) => success({ listing, sub }));
              }, fail);
            break;
          case "frontpage":
            r._getSortedFrontpage(sort, null, { t: time }).then(
              (listing) => success({ listing }),
              fail
            );
            break;
          default:
            break;
        }
      }
    },
    [fetched, r]
  );

  const options = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = getMode({ location, path, loggedIn });
    const { username, subName, multi, sort, type } = path;

    return {
      mode,
      type: map.types[mode]?.includes(type)
        ? path.type
        : "frontpage"
        ? map.types[mode][0]
        : null,
      username,
      subName,
      multi,
      query: searchParams.get("q"),
      sort: sort || searchParams.get("sort") || map.sorts[mode][0],
      time: searchParams.get("t") || "all",
      nsfw: searchParams.get("nsfw"),
      quarantine: searchParams.get("quarantine"),
    };
  }, [path, location, loggedIn])

  // useEffect(() => {
  //   console.info(path);
  //   const searchParams = new URLSearchParams(location.search);

  //   const mode = getMode({ location, path, loggedIn });

  //   const { username, subName, multi, sort, type } = path;

  //   const options = {
  //     mode,
  //     type: map.types[mode]?.includes(type)
  //       ? path.type
  //       : "frontpage"
  //       ? map.types[mode][0]
  //       : null,
  //     username,
  //     subName,
  //     multi,
  //     query: searchParams.get("q"),
  //     sort: sort || searchParams.get("sort") || map.sorts[mode][0],
  //     time: searchParams.get("t") || "all",
  //     nsfw: searchParams.get("nsfw"),
  //     quarantine: searchParams.get("quarantine"),
  //   };

  //   if (
  //     fetched?.listing?._method || // Listing has not fetched!
  //     Object.keys(options).some((key) => fetched?.options[key] !== options[key])
  //   ) {
  //     fetch(options);
  //   }
  // }, [path, location, loggedIn, fetch, fetched]);

  useEffect(() => {
    fetch(options);
  }, [options, fetch]);

  return error ? (
    <Error {...error} />
  ) : (
    <SubredditThemeProvider sub={fetched.sub} subName={fetched.options.subName}>
      {fetched.sub ? <SubredditBanner subreddit={fetched.sub} /> : null}
      <MixedListing
        listing={fetched.listing}
        inSubreddit={!!fetched.options.subName}
        compact={map.compactModes.includes(fetched.options.mode)}
      >
        {fetched.user ? (
          <UserCard user={fetched.user} username={fetched.username} />
        ) : null}
        {fetched.m ? <MultiCard m={fetched.m} /> : null}
        {fetched.options.query ? (
          <SearchCard query={fetched.options.query} />
        ) : null}
      </MixedListing>
    </SubredditThemeProvider>
  );
};

export default connect(
  (state) => ({
    loggedIn: state?.user?.name,
  }),
  { setLocation }
)(Page);
