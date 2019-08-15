import React, {
  useState,
  useContext,
  useEffect,
  // useCallback,
  // useMemo,
} from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setLocationName } from "../store/actions";
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
// import { Timestamp } from "../components/timestamp";

const Card = styled.article`
  margin: 1rem;
  background: ${({theme}) => theme.card.bg};
  border: 1px solid ${({theme}) => theme.card.border};
  padding: 0.75rem;
  border-radius: 0.5rem;
`;

const Trophies = styled.div`
  background: ${({theme}) => theme.header.bg};
  border: 1px solid ${({theme}) => theme.card.innerBorder};
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

const Karma = styled.div`
  font-size: 0.85rem;
`;

const Info = styled.div`
  height: 100%;
  margin-left: 0.75rem;
`;

const Actions = styled.div`
  margin-top: 0.5rem;
`;

const UserPage = ({
  match: { params: path } = {},
  setLocationName,
  username,
  loggedIn,
  ...props
}) => {
  const r = useContext(Requester);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState([]);
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    setLocationName(`u/${path.username}`);

    const userRequester = r.getUser(path.username);

    userRequester.fetch().then(
      (result) => {
        setUser(result);
        setLocationName(`u/${result.name}`);
        console.log("user", result);
      },
      (e) => setError({ e, type: "user", name: path.username })
    );

    userRequester.getOverview().then(
      (result) => {
        setOverview(result);
        console.log("Overview", result);
      },
      (e) => setError({ e, type: "user", name: path.username })
    );

    userRequester.getTrophies().then(
      (result) => {
        setTrophies(result.trophies);
        console.log("Trophies", result.trophies);
      },
      (e) => setError({ e, type: "trophies", name: path.username })
    );
  }, [path.username, setLocationName, r]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const toggleFriend = () => {
    user && user.is_friend ? user.unfriend() : user.friend();
    user
      .refresh()
      .then(
        (result) => setUser(result),
        (e) => setError({ e, type: "user", name: path.username })
      );
  };

  return (
    <Column>
      <Card>
        {user ? (
          <>
            <User>
              <Avatar src={user.icon_img} alt={user.name} />
              <Info>
                <Name
                  data-tip={`Account created ${Intl.DateTimeFormat().format(
                    user.created * 1000
                  )}`}
                >
                  {user.name}
                </Name>
                <Karma
                  data-multiline="true"
                  data-tip={`${Intl.NumberFormat().format(
                    user.comment_karma + user.link_karma
                  )} karma <br />${Intl.NumberFormat().format(
                    user.comment_karma
                  )} comment karma <br /> ${Intl.NumberFormat().format(
                    user.link_karma
                  )} link karma`}
                >
                  {formatNumber(user.comment_karma + user.link_karma)}
                </Karma>
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
                {user.is_friend ? "Remove Friend" : "Add Friend"}
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
      <Card>
        {user && overview.length === 0 ? (
          <SpinnerPage />
        ) : (
          overview.map((thing) =>
            thing.name.startsWith("t1") ? (
              <Comment
                comment={thing}
                username={username}
                loggedIn={loggedIn}
                key={thing.id}
              />
            ) : (
              <Post post={thing} inListing key={thing.id} />
            )
          )
        )}
      </Card>
      {error ? <Error {...error} /> : null}
    </Column>
  );
};

export default connect(
  (state) => ({
    username: state.user.name,
    loggedIn: !!state.user,
  }),
  { setLocationName }
)(UserPage);
