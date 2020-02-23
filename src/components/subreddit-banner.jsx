import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SubredditIcon from "./subreddit-icon";
import html2canvas from "html2canvas";
import Button from "./button";
import { formatNumber } from "./../utils/format-number";
import Tag from "./tags";

const SubredditBanner = ({
  subreddit,
  subreddit: {
    community_icon: communityIcon,
    icon_img: iconImg,
    icon_url: iconUrl,
    user_is_subscriber: subscribed,
  },
  subName = null,
  loggedIn,
}) => {
  const subIcon = useRef(null);
  const [img, setImg] = useState(null);

  document.querySelector('link[rel="shortcut icon"]').href =
    communityIcon ||
    iconImg ||
    iconUrl ||
    img ||
    require("../icons/favicon.png");

  useEffect(() => {
    if (!communityIcon && !iconImg && !iconUrl)
      html2canvas(subIcon.current, { backgroundColor: null }).then((canvas) =>
        setImg(canvas.toDataURL("image/png"))
      );
  }, [communityIcon, iconImg, iconUrl, subIcon]);

  console.info("subBanner:", subreddit);

  const [joined, setJoined] = useState(!loggedIn ? false : subscribed || false);

  const toggleJoined = () => {
    if (joined) subreddit.unsubscribe().then(setJoined(false));
    else subreddit.subscribe().then(setJoined(true));
  };

  return (
    <>
      <StyledBanner {...subreddit}>
        <SubredditIcon
          sub={subreddit}
          passRef={subIcon}
          subName={subName}
          size="xl"
          flat
        />
      </StyledBanner>

      <Bar>
        <BarContent>
          <section>
            <Button disabled={!loggedIn} onClick={toggleJoined}>
              {joined ? "Join" : "Leave"}
            </Button>
            {subreddit ? (
              <Info
                data-tip={
                  Intl.NumberFormat().format(subreddit.subscribers) +
                  " subscribers"
                }
              >
                {formatNumber(subreddit.subscribers, "subscriber")}
              </Info>
            ) : null}
          </section>
          <section>
            {subreddit && subreddit.over18 ? <Tag type="NSFW" /> : null}
          </section>
          <section>
            <Button>
              {subreddit
                ? subreddit.submit_text_label || "Submit text"
                : "Submit text"}
            </Button>
            <Button>
              {subreddit
                ? subreddit.submit_link_label || "Submit link"
                : "Submit link"}
            </Button>
          </section>
        </BarContent>
      </Bar>
    </>
  );
};

const BarContent = styled.div`
  max-width: 74rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 auto;
`;

const Bar = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.card.border};
  background-color: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.text};
  padding: 0.25rem;
  z-index: 10;
  position: sticky;
  top: 0;
`;

const Info = styled.span`
  font-size: 0.85rem;
`;

const StyledBanner = styled.div.attrs(
  ({ banner_background_color, banner_background_image }) => ({
    style: {
      backgroundColor: banner_background_color,
      backgroundImage: "url(" + banner_background_image + ")",
    },
  })
)`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  height: 10rem;
  cursor: pointer;
`;

export default connect(
  ({ subreddits, user, subscriptionNames }, { subreddit, subName = null }) => {
    return {
      subreddit: subreddit || subreddits[subName?.toLowerCase()] || {},
      loggedIn: !!user,
      subscriptionNames,
    };
  }
)(SubredditBanner);
