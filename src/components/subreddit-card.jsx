import React, { useState } from "react";
import Button from "./button";
import SubredditIcon from "./subreddit-icon";
// import { Timestamp } from "./timestamp";
import styled from "styled-components";
import { formatNumber } from "../utils/format-number";
import Card from "./card";
import SubredditThemeProvider from "../style/sub-theme-provider";

const Body = styled.div``;

const Banner = styled.div.attrs(({ banner, bg }) => ({
  style: {
    backgroundImage: `url(${banner})`,
    backgroundColor: bg,
  },
}))`
  height: 2rem;
`;

export default ({
  sub,
  sub: {
    banner_background_color: bannerBg,
    banner_background_image: banner,
    display_name: subName,
    // header_title,
    // header_img,
    // community_icon,
    // icon_img,
    primary_color: primaryColor,
    key_color: keyColor,
    id,
    subscribers,
    accounts_active: accountsActive,
    created_utc: created,
    url,
    // title,
    public_description_html: descriptionHtml,
    user_is_subscriber: isSubscriber,
  },
}) => {
  const [subscribed, setSubscribed] = useState(isSubscriber);
  const toggleSubscribe = () => setSubscribed((bool) => !bool);
  const bg = bannerBg || primaryColor || keyColor || null;
  return (
    <SubredditThemeProvider sub={sub}>
      <Card>
        <Banner bg={bg} banner={banner} />
        <Body>
          <SubredditIcon sub={sub} />
          <Button to={url}>{`r/${subName}`}</Button>
          <span>{formatNumber(subscribers, "user")}</span>
          {accountsActive !== null ? (
            <span>{formatNumber(accountsActive, "active user")}</span>
          ) : null}
          {/* <span
              className="body"
              dangerouslySetInnerHTML={{
                __html: descriptionHtml,
              }}
            /> */}
          {/* <Timestamp time={created} to={"#" + id} /> */}
          <Button primary onClick={toggleSubscribe}>
            {subscribed ? "Leave" : "Join"}
          </Button>
        </Body>
      </Card>
    </SubredditThemeProvider>
  );
};
