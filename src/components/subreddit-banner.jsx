import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SubredditIcon from "./subreddit-icon";
import html2canvas from "html2canvas";
import Button from "./button";
import { withRouter } from "react-router-dom";

const SubredditBanner = ({
  subreddit,
  subName = null,
  user,
  subscriptionNames,
  history,
}) => {
  const subIcon = useRef(null);
  const [img, setImg] = useState(null);

  const { community_icon, icon_img, icon_url } = subreddit;

  document.querySelector('link[rel="shortcut icon"]').href =
    community_icon ||
    icon_img ||
    icon_url ||
    img ||
    require("../icons/favicon.png");

  useEffect(() => {
    if (!subreddit.community_icon && !subreddit.icon_img && !subreddit.icon_url)
      html2canvas(subIcon.current, { backgroundColor: null }).then((canvas) =>
        setImg(canvas.toDataURL("image/png"))
      );
  }, [subreddit, subIcon]);

  const goToSub = () => {
    history.push(`/r/${subName}`);
  };

  return (
    <>
      <StyledBanner {...subreddit} onClick={goToSub}>
        <SubredditIcon passRef={subIcon} subName={subName} size="xl" flat />
      </StyledBanner>

      <ViewSettings>
        {user ? (
          <Button>
            {subscriptionNames.includes(subName.toLowerCase())
              ? "Leave"
              : "Join"}
          </Button>
        ) : null}
      </ViewSettings>
    </>
  );
};

const ViewSettings = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.card.border};
  background-color: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.color};
  padding: 0.25rem;
  z-index: 10;
`;

const StyledBanner = styled.div.attrs(
  ({ banner_background_color, banner_background_image }) => ({
    style: {
      backgroundColor: banner_background_color,
      backgroundImage: "url(" + banner_background_image + ")",
      // height: props.display_name ? "10rem" : "0" // Detects frontpage/popular/all
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
  background-color: ${({ theme }) => theme.header.bg};
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  height: 10rem;
  cursor: pointer;
`;

function mapStateToProps(state, { subName = null }) {
  const { subreddits, user, subscriptionNames } = state;

  if (subName && subreddits[subName.toLowerCase()]) {
    return {
      subreddit: subreddits[subName.toLowerCase()],
      user,
      subscriptionNames,
    };
  }
  return { subreddit: {}, user, subscriptionNames };
}

export default connect(mapStateToProps)(withRouter(SubredditBanner));
