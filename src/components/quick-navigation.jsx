import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import SubredditIcon from "./subreddit-icon";
import uniqueId from "../utils/unique-id";
import Button from "./button";
import ReactTooltip from "react-tooltip";

const Navigation = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  /* height: 100%; */
`;

const Favorite = styled.div`
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.color : "transparent")};
  padding-bottom: 0.125rem;
  margin: 0 0.5rem;
`;

const IconLink = ({ to, active, ...props }) => (
  <Favorite active={active}>
    <Link to={to}>
      <StyledIcon {...props} />
    </Link>
  </Favorite>
);

const StyledIcon = styled.div`
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.1s ease;
  border-radius: 50%;
  /* border: 1px solid ${({ active }) => (active ? "red" : "transparent")}; */
  &:hover {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.focus.glow};
  }
`;

const QuickNavigation = ({ favorites = [], location }) => {
  const [favoriteIcons, setFavoriteIcons] = useState([]);

  useEffect(() => {
    setFavoriteIcons(
      favorites.slice(0, 5).map((sub) => (
        <IconLink
          to={"/r/" + sub.display_name}
          key={uniqueId()}
          data-tip={"r/" + sub.display_name + " <br /> " + sub.title}
          data-multiline={true}
          data-place="right"
          data-delay-show={0}
          active={location.name === sub.display_name}
        >
          <SubredditIcon subName={sub.display_name} size="small" />
        </IconLink>
      ))
    );
  }, [favorites, location.name]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [favoriteIcons]);

  return (
    <Navigation>
      <Button
        icon="home"
        data-tip="Frontpage <br /> Your joined communities"
        data-multiline={true}
        data-delay-show={0}
        to="/"
        size="large"
      />
      <Button
        icon="trendingUp"
        data-tip="r/popular <br /> Reddit's most active communities"
        data-multiline={true}
        data-delay-show={0}
        to="/r/popular/"
        size="large"
      />
      <Button
        icon="barChart2"
        data-tip="r/all <br /> All communities of reddit"
        data-multiline={true}
        data-delay-show={0}
        to="/r/all/"
        size="large"
      />
      {favoriteIcons}
    </Navigation>
  );
};

const extractSubData = ({
  display_name,
  path,
  url,
  curator,
  community_icon,
  icon_img,
  icon_url,
  primary_color,
  key_color,
  banner_background_color,
  title,
}) => {
  return {
    display_name,
    path,
    url,
    curator,
    community_icon,
    icon_img,
    icon_url,
    primary_color,
    key_color,
    banner_background_color,
    title,
  };
};

const mapStateToProps = ({ subreddits, favoriteNames, location }) => {
  let favorites = [];
  if (favoriteNames) {
    favorites = favoriteNames.reduce((favorites, name) => {
      if (subreddits[name]) favorites.push(extractSubData(subreddits[name]));
      return favorites;
    }, []);
  }

  return {
    favorites,
    location,
  };
};

export default connect(mapStateToProps)(QuickNavigation);
