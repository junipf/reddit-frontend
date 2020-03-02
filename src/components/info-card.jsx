import React, { useState, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Requester } from "./requester";
import Error from "./error";
import { SpinnerPage } from "./spinner";
import { formatNumber } from "../utils/format-number";
import Icon from "./icon";
import Card from "./card";

const Main = styled.div`
  width: 100%;
  line-height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Image = styled.img`
  height: 4rem;
  width: 4rem;
  border-radius: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.25rem;
  line-height: 1.35rem;
`;

const Line = styled.div`
  font-size: 1rem;
  line-height: 1.25rem;
`;

const Info = styled.div`
  height: 3.5rem;
  margin: 0.5rem 0.75rem;
`;

const Trophies = styled.div`
  background: ${({ theme }) => theme.header.bg};
  border: 1px solid ${({ theme }) => theme.card.innerBorder};
  padding: 0.25rem 0.4rem;
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  font-size: 0.65rem;
  img {
    max-width: 2.5rem;
    margin: 0.5rem;
  }
`;

export const SearchCard = ({ query }) => (
  <Card>
    <Icon icon="search" inline /> Search results for "{query}"
  </Card>
);

export const MultiCard = ({ m }) => {
  const cakeday = new Date(m.created * 1000);
  return (
    <Card>
      <Main>
        <Image src={m.icon_url} alt={m.name} />
        <Info>
          <Name>{m.display_name}</Name>
          <Line>Created by {m.owner}</Line>
          <Line
            data-multiline="true"
            data-tip={`Multireddit created <br /> ${cakeday.toLocaleString()}`}
          >
            <Icon icon="calendar" inline marginRight />
            {cakeday.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Line>
        </Info>
      </Main>
    </Card>
  );
};

export const UserCard = ({ username }) => {
  const r = useContext(Requester);
  const [user, setUser] = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(
    ({ username }) => {
      const userRequester = r.getUser(username);
      if (username != null && username !== "me" && user === null) {
        // console.log(username, username === "me", !username);
        userRequester.fetch().then(
          (user) =>
            setUser({
              ...user,
              cakeday: new Date(user.created * 1000),
            }),
          (e) => setError({ e, type: "user", name: username })
        );
        userRequester.getTrophies().then(
          (trophies) => setTrophies(trophies.trophies),
          (e) => setError({ e, type: "trophies", name: username })
        );
      }
    },
    [r, user]
  );

  // Fetch user-specific non-listing data
  useEffect(() => {
    if (username && username !== "" && username !== "me")
      fetchUser({ username });
  }, [username, fetchUser]);

  return error ? (
    <Error {...error} />
  ) : user !== null ? (
    <Card>
      <Main>
        <Image src={user.icon_img} alt={user.name} />
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
            <Icon icon="loader" inline marginRight />
            {formatNumber(user.comment_karma + user.link_karma, "point")}
          </Line>
          <Line
            data-multiline="true"
            data-tip={`Account created <br /> ${user.cakeday.toLocaleString()}`}
          >
            <Icon icon="calendar" inline marginRight />
            {user.cakeday.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Line>
        </Info>
      </Main>
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
    </Card>
  ) : (
    <Card>
      <SpinnerPage />
    </Card>
  );
};
