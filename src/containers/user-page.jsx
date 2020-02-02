import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  Fragment,
  // useMemo,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setLocation } from "../store/actions";
import { Link } from "react-router-dom";
import { Requester } from "../components/requester";
import ReactTooltip from "react-tooltip";

import { Column } from "./column";
import Button from "../components/button";
import Error from "../components/error";
import Comment from "./comment";
import Post from "./post";
import { SpinnerPage } from "../components/spinner";
import { formatNumber } from "./../utils/format-number";
import Icon from "../components/icon";
// import { Timestamp } from "../components/timestamp";

const Card = styled.article`
  margin: 1rem;
  background: ${({ theme }) => theme.card.bg};
  border: 1px solid ${({ theme }) => theme.card.border};
  padding: 0.65rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

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

const Trophies = styled.div`
  background: ${({ theme }) => theme.header.bg};
  border: 1px solid ${({ theme }) => theme.card.innerBorder};
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  font-size: 0.65rem;
  img {
    max-width: 2.5rem;
    margin: 0.5rem;
  }
`;

const User = styled.div`
  width: 100%;
  line-height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  max-width: 2.25rem;
  border-radius: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.25rem;
`;

const Line = styled.div`
  font-size: 0.85rem;
`;

const Info = styled.div`
  height: 100%;
  margin-left: 0.75rem;
`;

const Actions = styled.div`
  margin-top: 0.5rem;
`;

const PostLine = styled.div`
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

const Permalink = ({ to }) => (
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
  loggedInUsername,
  loggedIn,
  ...props
}) => {
  const r = useContext(Requester);
  const [error, setError] = useState(null);

  // const [fetched, setFetched] = useState({
  //   listing: [],
  //   trophies: [],
  // });

  const [fetchedUser, setFetchedUser] = useState(null);
  const [fetchedTrophies, setFetchedTrophies] = useState([]);
  const [fetchedListing, setFetchedListing] = useState(null);

  const defaults = {
    name: null,
    sort: "new",
    time: "all",
    type: "overview",
  };

  const fetchListing = useCallback(
    ({ username, options, type }) => {
      const user = r.getUser(username);
      const success = (listing) => setFetchedListing({ listing, type });
      const fail = (e) => setError({ e, type, name: username + " " + type });
      if (fetchedListing === null || fetchedListing.type !== type) {
        console.info(`fetching new listing: ${username}, ${type}`);
        switch (type) {
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
      } else {
        console.info(
          `effect triggered, but listing already fetched: ${username}, ${type}`
        );
      }
    },
    [fetchedListing, r]
  );

  const fetchUser = useCallback(
    ({ username }) => {
      const user = r.getUser(username);
      if (
        username &&
        username !== "me" &&
        (!fetchedUser || username !== fetchedUser.name)
      ) {
        user.fetch().then(
          (user) => {
            setFetchedUser({
              ...user,
              cakeday: new Date(user.created * 1000),
            });
            // console.log("user", user);
          },
          (e) => setError({ e, type: "user", name: username })
        );
        user.getTrophies().then(
          (trophies) => {
            setFetchedTrophies(trophies);
            // console.log("Trophies", trophies);
          },
          (e) => setError({ e, type: "trophies", name: username })
        );
      }
    },
    [r, fetchedUser]
  );

  // Fetch user-specific non-listing data
  useEffect(() => {
    const { username, type } = path;

    if (username === "me") {
      history.replace(`/user/${loggedInUsername}`);
    } else if (username) {
      fetchUser({ username });
    }

    const searchParams = new URLSearchParams(location.search);

    fetchListing({
      username,
      options: {
        sort: searchParams.get("sort") || defaults.sort,
        time: searchParams.get("t") || defaults.time,
      },
      type,
    });
  }, [
    path,
    location.search,
    defaults,
    fetchListing,
    fetchUser,
    history,
    loggedIn,
    loggedInUsername,
  ]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const toggleFriend = () => {
    // fetchedUser && fetchedUser.is_friend
    //   ? fetchedUser.unfriend()
    //   : fetchedUser.friend();
    // fetchedUser
    //   .refresh()
    //   .then(
    //     (user) => setFetched((fetched) => ({ ...fetched, user })),
    //     (e) => setError({ e, type: "user", name: path.username })
    //   );
  };

  return (
    <Column>
      <Card>
        {fetchedUser ? (
          <>
            <User>
              <Avatar src={fetchedUser.icon_img} alt={fetchedUser.name} />
              <Info>
                <Name
                  data-tip={
                    fetchedUser.created && !isNaN(fetchedUser.created)
                      ? `Account created ${Intl.DateTimeFormat().format(
                          fetchedUser.created * 1000
                        )}`
                      : null
                  }
                >
                  {fetchedUser.name}
                </Name>

                <Line
                  data-multiline="true"
                  data-tip={`${Intl.NumberFormat().format(
                    fetchedUser.comment_karma + fetchedUser.link_karma
                  )} karma <br />${Intl.NumberFormat().format(
                    fetchedUser.comment_karma
                  )} comment karma <br /> ${Intl.NumberFormat().format(
                    fetchedUser.link_karma
                  )} link karma`}
                >
                  <Icon icon="loader" align="none" />
                  {formatNumber(
                    fetchedUser.comment_karma + fetchedUser.link_karma,
                    "point"
                  )}
                </Line>
                <Line
                  data-multiline="true"
                  data-tip={`Account created <br /> ${fetchedUser.cakeday.toLocaleString()}`}
                >
                  <Icon icon="calendar" align="none" />
                  {fetchedUser.cakeday.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Line>
              </Info>
            </User>
            {fetchedTrophies.length > 0 ? (
              <Trophies>
                {fetchedTrophies.map((trophy, i) => {
                  const img = (
                    <img
                      src={trophy.icon_70}
                      alt={trophy.name}
                      key={i}
                      data-tip={trophy.name}
                    />
                  );
                  const url =
                    trophy.url &&
                    trophy.url.replace(/https?:\/\/www.reddit.com/, "");
                  return url ? (
                    url.startsWith("http") ? (
                      <a href={url} key={i}>
                        {img}
                      </a>
                    ) : (
                      <Link to={url} key={i}>
                        {img}
                      </Link>
                    )
                  ) : (
                    img
                  );
                })}
              </Trophies>
            ) : null}
            <Actions>
              <Button onClick={toggleFriend}>
                {fetchedUser.is_friend ? "Remove Friend" : "Add Friend"}
              </Button>
              <Button disabled data-tip="Not yet available">
                Send message
              </Button>
            </Actions>
          </>
        ) : (
          <SpinnerPage />
        )}
      </Card>
      {fetchedListing === null ? (
        <SpinnerPage />
      ) : (
        fetchedListing.listing.map((thing, index, array) =>
          thing.name.startsWith("t1") ? (
            index === 0 ||
            (array[index - 1] && thing.link_id !== array[index - 1].link_id) ? (
              <Card key={thing.name}>
                <PostLine>
                  Comment
                  {array[index + 1] &&
                  array[index + 1].link_id === thing.link_id
                    ? "s"
                    : ""}{" "}
                  on <a href={thing.link_permalink}>{thing.link_title}</a>
                  {/* {" by "} */}
                  {/* <a href={`/user/${thing.link_author}`}>u/{thing.link_author}</a> */}
                  {" on "}
                  <a href={"/" + thing.subreddit_name_prefixed}>
                    {thing.subreddit_name_prefixed}
                  </a>
                </PostLine>
                <Comment
                  comment={thing}
                  username={loggedInUsername}
                  loggedIn={loggedIn}
                  key={thing.id}
                  compact
                />
                <Permalink to={thing.permalink} />
                {array.slice(index + 1).map((sibling) =>
                  sibling.name.startsWith("t1") &&
                  sibling.link_id === thing.link_id ? (
                    <Fragment 
                    key={sibling.id}>
                      <Comment
                        comment={sibling}
                        username={loggedInUsername}
                        loggedIn={loggedIn}
                        // key={sibling.id}
                        compact
                      />
                      <Permalink to={sibling.permalink} />
                    </Fragment>
                  ) : null
                )}
              </Card>
            ) : null
          ) : (
            <Post post={thing} inListing key={thing.id} compact />
          )
        )
      )}
      {error ? <Error {...error} /> : null}
    </Column>
  );
};

export default connect(
  (state) => ({
    loggedInUsername: state.user?.name,
    loggedIn: !!state.user,
  }),
  { setLocation }
)(UserPage);
