import React, { Fragment } from "react";
import Comment from "./comment";
import Post from "./post";
import { SpinnerPage } from "../components/spinner";
import Card from "../components/card";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Icon from "../components/icon";

const Listing = styled.div`
  max-width: 73.5rem;
  margin: 1rem auto;
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

const Center = styled.span`
  padding: 0.5rem;
  text-align: center;
  display: block;
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

export const Permalink = ({ to }) => (
  <StyledPermalink>
    <Link to={to}>
      View Comment <Icon inline icon="externalLink" />
    </Link>
  </StyledPermalink>
);

export default ({ listing, compact, inSubreddit, children, ...props }) => (
  <Listing>
    {children}
    {!listing._r ? (
      <SpinnerPage />
    ) : listing.length === 0 && listing._r ? (
      <Center>Nothing to show here!</Center>
    ) : (
      <>
        {listing.map((thing, index, array) =>
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
            <Post
              post={thing}
              inListing
              inSubreddit={inSubreddit}
              key={thing.id}
              compact={compact}
            />
          )
        )}
      </>
    )}
  </Listing>
);
