import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SubredditIcon from "./subreddit-icon";
import html2canvas from "html2canvas";
import Button from "./button";
import { withRouter } from "react-router-dom";
import { formatNumber } from "./../utils/format-number";
import Tag from "./tags";

const SubredditBanner = ({
  subreddit,
  subreddit: {
    community_icon: communityIcon,
    icon_img: iconImg,
    icon_url: iconUrl,
  },
  subName = null,
  user,
  subscriptionNames,
  history,
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

  const goToSub = () => {
    history.push(`/r/${subName}`);
  };

  return (
    <>
      <StyledBanner {...subreddit} onClick={goToSub}>
        <SubredditIcon passRef={subIcon} subName={subName} size="xl" flat />
      </StyledBanner>

      <Bar>
        <BarContent>
          <section>
            <Button disabled={!user}>
              {subscriptionNames && subscriptionNames.includes(subName.toLowerCase())
                ? "Leave"
                : "Join"}
            </Button>
            {subreddit ? (
              <span
                data-tip={
                  Intl.NumberFormat().format(subreddit.subscribers) +
                  " subscribers"
                }
              >
                {formatNumber(subreddit.subscribers)}
              </span>
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
