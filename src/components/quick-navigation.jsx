import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import SubredditIcon from "./subreddit-icon";
// import uniqueId from "../utils/unique-id";
import ReactTooltip from "react-tooltip";
import BasicNavigation from "./basic-navigation";

const Favorite = styled.div`
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.text : "transparent")};
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
          key={sub.display_name}
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
    <>
      {/* <Navigation> */}
      <BasicNavigation />
      {favoriteIcons}
      {/* </Navigation> */}
    </>
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
