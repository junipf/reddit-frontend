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

import Column from "./column";
import Error from "../components/error";
import Comment from "./comment";
import Post from "./post";
import { SpinnerPage } from "../components/spinner";
import { formatNumber } from "./../utils/format-number";
import Icon from "../components/icon";
// import { Timestamp } from "../components/timestamp";

import useIntersect from "../utils/use-intersect";

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
  // const r = useContext(Requester);
  // const [error, setError] = useState(null);

  // const [fetchedListing, setFetchedListing] = useState([]);

  // Fetch user-specific non-listing data
  useEffect(() => {
    if (path.username === "me") history.replace(`/user/${loggedInUsername}`);
  }, [path.username, history, loggedIn, loggedInUsername]);

  // Fetch listing

  // useEffect(() => {
  //   console.info("!!! PATH updated: ", path);
  // }, [path]);

  // useEffect(() => {
  //   console.info("location.search updated: ", location.search)
  // }, [location.search]);

  // useEffect(() => {
  //   console.info("//////////////////////// defaults updated: ", defaults);
  // }, [defaults]);

  // useEffect(() => {
  //   console.info("listing updated: ", fetchedListing);
  // }, [fetchedListing]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <Column>
      <UserCard username={path.username} />
      <UserPageListing path={path} location={location} />
      {/* <FetchMoreSpinner
        listing={fetchedListing}
        setListing={setFetchedListing}
      /> */}
      {/* {error ? <Error {...error} /> : null} */}
    </Column>
  );
};

const UserCard = ({ username }) => {
  const r = useContext(Requester);
  const [user, setUser] = useState(null);
  const [trophies, setTrophies] = useState([]);

  const [error, setError] = useState(null);

  const fetchUser = useCallback(
    ({ username }) => {
      const userRequester = r.getUser(username);
      if (username && username !== "me" && (!user || username !== user.name)) {
        userRequester.fetch().then(
          (user) => {
            setUser({
              ...user,
              cakeday: new Date(user.created * 1000),
            });
          },
          (e) => setError({ e, type: "user", name: username })
        );
        userRequester.getTrophies().then(
          (trophies) => {
            setTrophies(trophies);
          },
          (e) => setError({ e, type: "trophies", name: username })
        );
      }
    },
    [r, user]
  );

  // Fetch user-specific non-listing data
  useEffect(() => {
    if (username && username !== "") fetchUser({ username });
  }, [username, fetchUser]);

  return error ? (
    <Error {...error} />
  ) : user !== null ? (
    <Card>
      <User>
        <Avatar src={user.icon_img} alt={user.name} />
        <Info>
          <Name
            data-tip={
              user.created && !isNaN(user.created)
                ? `Account created ${Intl.DateTimeFormat().format(
                    user.created * 1000
                  )}`
                : null
            }
          >
            {user.name}
          </Name>

          <Line
            data-multiline="true"
            data-tip={`${Intl.NumberFormat().format(
              user.comment_karma + user.link_karma
            )} karma <br />${Intl.NumberFormat().format(
              user.comment_karma
            )} comment karma <br /> ${Intl.NumberFormat().format(
              user.link_karma
            )} link karma`}
          >
            <Icon icon="loader" align="none" />
            {formatNumber(user.comment_karma + user.link_karma, "point")}
          </Line>
          <Line
            data-multiline="true"
            data-tip={`Account created <br /> ${user.cakeday.toLocaleString()}`}
          >
            <Icon icon="calendar" align="none" />
            {user.cakeday.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Line>
        </Info>
      </User>
      {trophies.length > 0 ? (
        <Trophies>
          {trophies.map((trophy, i) => {
            const img = (
              <img
                src={trophy.icon_70}
                alt={trophy.name}
                key={i}
                data-tip={trophy.name}
              />
            );
            const url =
              trophy.url && trophy.url.replace(/https?:\/\/www.reddit.com/, "");
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
      {/* <Actions>
  <Button onClick={toggleFriend}>
    {fetchedUser.is_friend ? "Remove Friend" : "Add Friend"}
  </Button>
  <Button disabled data-tip="Not yet available">
    Send message
  </Button>
</Actions> */}
    </Card>
  ) : (
    <Card>
      <SpinnerPage />
    </Card>
  );
};

const UserPageListing = ({ path, location }) => {
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
    ({ username, type, sort, time }) => {
      const user = r.getUser(username);
      const options = { sort, time };
      const success = (listing) => {
        console.log(listing);
        setFetched({ listing, username, type, sort, time });
      };
      const fail = (e) => setError({ e, type, name: username + " " + type });
      if (fetched.listing.length === 0 || fetched.type !== type) {
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
      }
    },
    [fetched, r]
  );

  useEffect(() => {
    const { username, type } = path;
    const searchParams = new URLSearchParams(location.search);

    fetch({
      username,
      sort: searchParams.get("sort") || defaults.sort,
      time: searchParams.get("t") || defaults.time,
      type: type || defaults.type,
    });
  }, [path, location.search, defaults, fetch]);

  return error ? (
    <Error {...error} />
  ) : (
    <MixedListing listing={fetched.listing} />
  );
};

const MixedListing = ({ listing }) => {
  return listing.length === 0 ? (
    <SpinnerPage />
  ) : (
    <ul>
      {listing.map((thing, index, array) =>
        thing.name.startsWith("t1") ? (
          index === 0 ||
          (array[index - 1] && thing.link_id !== array[index - 1].link_id) ? (
            <Card key={thing.name}>
              <PostLine>
                Comment
                {array[index + 1] && array[index + 1].link_id === thing.link_id
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
              <Comment comment={thing} key={thing.id} compact />
              <Permalink to={thing.permalink} />
              {array.slice(index + 1).map((sibling) =>
                sibling.name.startsWith("t1") &&
                sibling.link_id === thing.link_id ? (
                  <Fragment key={sibling.id}>
                    <Comment comment={sibling} compact />
                    <Permalink to={sibling.permalink} />
                  </Fragment>
                ) : null
              )}
            </Card>
          ) : null
        ) : (
          <Post post={thing} inListing key={thing.id} compact />
        )
      )}
    </ul>
  );
};

const FetchMoreSpinner = ({ listing, setListing }) => {
  const [$spinner, entry] = useIntersect({
    threshold: 0.1,
  });

  useEffect(() => {
    if (
      listing?.fetched &&
      entry.intersectionRatio > 0.1 &&
      !listing?.isFinished
    ) {
      listing.fetchMore().then((listing) => setListing(listing));
    }
  }, [entry, listing, setListing]);

  return <SpinnerPage forwardRef={$spinner} />;
};

export default connect(
  (state) => ({
    loggedInUsername: state.user?.name,
    loggedIn: !!state.user,
  }),
  { setLocation }
)(UserPage);
