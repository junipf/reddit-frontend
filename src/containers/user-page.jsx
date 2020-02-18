import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  // useMemo,
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
import UserCard from "../components/user-card";
import MultiCard from "../components/multi-card";
import { SpinnerPage } from "../components/spinner";

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

const UserPage = ({
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
      ) : path.username === "me" || !path.username ? (
        <SpinnerPage />
      ) : (
        <Listing path={path} location={location} />
      )}
    </Column>
  );
};

const Listing = ({ path, location }) => {
  const r = useContext(Requester);
  const [fetched, setFetched] = useState({
    listing: [],
    type: null,
  });

  const [error, setError] = useState(null);

  const defaults = {
    name: null,
    sort: "new",
    time: "all",
    type: "overview",
  };

  const fetch = useCallback(
    ({ username, type, sort, time, multi }) => {
      const user = r.getUser(username);
      const options = { sort, t: time };
      const success = (listing, m) => {
        console.log(listing);
        setFetched({ listing, username, type, sort, time, multi, m });
      };
      const fail = (e) => setError({ e, type, name: username + " " + type });
      if (
        !fetched.listing._method ||
        fetched.type !== type ||
        fetched.sort !== sort ||
        fetched.time !== time ||
        fetched.username !== username ||
        fetched.multi !== multi
      ) {
        console.info(`fetching new listing: ${username}, ${type}`);
        switch (type) {
          case "m":
            user
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
                      .then(success, fail)
                      .catch((e) => {
                        setError({
                          name: `m/${multi}`,
                          e,
                          type: "multireddit",
                        });
                      });
                  // r.getSubreddit(subNames)
                  //   .getHot()
                  //   .then((listing) => success(listing, m), fail);
                })
              );
            break;
          case "posts":
            user.getSubmissions(options).then(success, fail);
            break;
          case "saved":
            user.getSavedContent(options).then(success, fail);
            break;
          case "hidden":
            user.getHiddenContent(options).then(success, fail);
            break;
          case "upvoted":
            user.getUpvotedContent(options).then(success, fail);
            break;
          case "downvoted":
            user.getDownvotedContent(options).then(success, fail);
            break;
          case "comments":
            user.getComments(options).then(success, fail);
            break;
          default:
            user.getOverview(options).then(success, fail);
        }
      }
    },
    [fetched, r]
  );

  useEffect(() => {
    const { username, type, multi } = path;
    const searchParams = new URLSearchParams(location.search);

    fetch({
      username,
      sort: searchParams.get("sort") || defaults.sort,
      time: searchParams.get("t") || defaults.time,
      type: type || defaults.type,
      multi,
    });
  }, [path, location.search, defaults, fetch]);

  return error ? (
    <Error {...error} />
  ) : (
    <>
      {fetched.user ? (
        <UserCard user={fetched.user} username={fetched.username} />
      ) : null}
      {fetched.m ? <MultiCard m={fetched.m} /> : null}
      <MixedListing listing={fetched.listing} />
    </>
  );
};

export default connect(
  (state) => ({
    loggedIn: state?.user?.name,
  }),
  { setLocation }
)(UserPage);
