import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import ReactTooltip from "react-tooltip";
import Error from "../components/error";
import { UserCard, MultiCard, SearchCard } from "../components/info-card";
import { SpinnerPage } from "../components/spinner";
import { map, getMode } from "./settings";
import { ProgressUnderline } from "../components/progress-bar";

import MixedListing from "./mixed-listing";
import FetchMoreSpinner from "../components/fetch-more-spinner";

const Page = ({
  history,
  path,
  search,
  loggedIn,
  hideSelf,
  visible,
  ...props
}) => {
  const [error, setError] = useState(null);
  // Fetch user-specific non-listing data
  useEffect(() => {
    if (path?.username === "me")
      if (loggedIn) history.replace(`/user/${loggedIn}`);
      else
        setError({
          e: {
            message: "You are not logged in, so we can't redirect from u/me",
          },
        });
  }, [path, history, loggedIn]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <>
      {error ? (
        <Error {...error} />
      ) : path?.username === "me" ? (
        <SpinnerPage />
      ) : (
        <Listing path={path} search={search} />
      )}
    </>
  );
};

const Listing = ({ path, search, loggedIn }) => {
  const r = useContext(Requester);
  const [fetched, setFetched] = useState({
    listing: { isFinished: true },
    type: null,
    options: {},
  });
  const [error, setError] = useState(null);
  const loading = useMemo(() => fetched.listing === [], [fetched]);

  const fetch = useCallback(
    (
      options = {
        mode: null,
        type: null,
        username: null,
        subName: null,
        multi: null,
        sort: null,
        time: null,
        query: null,
        nsfw: null,
        quarantine: null,
      }
    ) => {
      const {
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
      } = options;

      // console.info(options);

      const success = ({ listing, m, sub, user }) => {
        // console.log(mode, listing);
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

      const hasChanged = Object.keys(options).some(
        (key) => options[key] !== fetched.options[key]
      );

      if (!fetched.listing._method || hasChanged) {
        // console.info("UniListing fetching new listing with options:", options);
        // setFetched({
        //   listing: [],
        //   type: null,
        //   options: {},
        // });
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
                  .then((listing) => success({ listing, user }), fail);
                break;
              case "saved":
                user
                  .getSavedContent(options)
                  .then((listing) => success({ listing, user }), fail);
                break;
              case "hidden":
                user
                  .getHiddenContent(options)
                  .then((listing) => success({ listing, user }), fail);
                break;
              case "upvoted":
                user
                  .getUpvotedContent(options)
                  .then((listing) => success({ listing, user }), fail);
                break;
              case "downvoted":
                user
                  .getDownvotedContent(options)
                  .then((listing) => success({ listing, user }), fail);
                break;
              case "comments":
                user
                  .getComments(options)
                  .then((listing) => success({ listing, user }), fail);
                break;
              default:
                user
                  .getOverview(options)
                  .then((listing) => success({ listing, user }), fail);
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

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    // console.log(path);
    if (path && !path.id) {
      const mode = getMode({ search, path, loggedIn });
      const {
        username = null,
        subName = null,
        multi = null,
        sort = null,
        type = null,
      } = path;
      fetch({
        mode,
        type: map.types[mode]?.includes(type)
          ? path.type
          : "frontpage"
          ? map.types[mode][0]
          : null,
        username,
        subName,
        multi: multi,
        query: searchParams.get("q"),
        sort: sort || searchParams.get("sort") || map.sorts[mode][0],
        time: searchParams.get("t") || "all",
        nsfw: searchParams.get("nsfw"),
        quarantine: searchParams.get("quarantine"),
      });
    }
  }, [path, search, loggedIn, fetch]);

  const handleFetchMore = useCallback((listing) => {
    setFetched((f) => ({ ...f, listing }));
  }, []);

  return error ? (
    <Error {...error} />
  ) : (
    <>
      <MixedListing
        listing={fetched.listing}
        inSubreddit={!!fetched.options.subName}
        compact={map.compactModes.includes(fetched.options.mode)}
      >
        {!error && loading ? <ProgressUnderline /> : null}
        {fetched.user ? (
          <UserCard user={fetched.user} username={fetched.options.username} />
        ) : null}
        {fetched.m ? <MultiCard m={fetched.m} /> : null}
        {fetched.options.query ? (
          <SearchCard query={fetched.options.query} />
        ) : null}
      </MixedListing>
      {fetched.listing.isFinished ? null : (
        <FetchMoreSpinner
          listing={fetched.listing}
          setListing={handleFetchMore}
        />
      )}
    </>
  );
};

export default connect((state) => ({
  loggedIn: state?.user?.name,
}))(Page);
