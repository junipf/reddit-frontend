import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import SubredditIcon, {
  FrontpageIcon,
  PopularIcon,
  AllIcon,
} from "./subreddit-icon";
import { Spinner } from "./spinner";
import uniqueId from "../utils/unique-id";

const Favorites = styled.div`
  display: flex;
  flex-flow: inherit;
  align-items: center;
`;
const Navigation = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  /* height: 100%; */
`;

const IconLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-bottom: 0.5em;
  transition: box-shadow 0.1s ease;
  border-radius: 50%;
  border: 5px solid
    ${props =>
      props.active ? "red" : "transparent"};
  &:hover {
    box-shadow: 0 0 0 3px ${props => props.theme.button.primary.focus};
  }
`;

export const QuickNavigation = ({ favorites = [], locationName }) => (
  <Navigation>
    <IconLink
      to={"/"}
      data-tip="Frontpage <br /> Your joined communities"
      data-multiline={true}
      data-place="right"
      data-delay-show={0}
      key={0}
      active={locationName === "Frontpage"}
    >
      <FrontpageIcon size="large" />
    </IconLink>
    <IconLink
      to={"/r/popular"}
      data-tip="r/Popular <br /> Reddit's most active communities"
      data-multiline={true}
      data-place="right"
      data-delay-show={0}
      key={1}
      active={locationName === "popular"}
    >
      <PopularIcon size="large" />
    </IconLink>
    <IconLink
      to={"/r/all"}
      data-tip="r/All <br /> All communities of reddit"
      data-multiline={true}
      data-place="right"
      data-delay-show={0}
      key={2}
      active={locationName === "all"}
    >
      <AllIcon size="large" />
    </IconLink>
    <Favorites>
      {favorites.length > 0 ? (
        favorites.slice(0, 5).map(sub => (
          <IconLink
            to={"/r/" + sub.display_name}
            key={uniqueId()}
            data-tip={"r/" + sub.display_name + " <br /> " + sub.title}
            data-multiline={true}
            data-place="right"
            data-delay-show={0}
            active={locationName === sub.display_name}
          >
            <SubredditIcon {...sub} size="large" />
          </IconLink>
        ))
      ) : (
        <Spinner />
      )}
    </Favorites>
  </Navigation>
);

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

function mapStateToProps(state) {
  const { subreddits, favoriteNames, locationName } = state;

  let favorites = [];
  if (favoriteNames) {
    favorites = favoriteNames.reduce((favorites, name) => {
      if (subreddits[name]) favorites.push(extractSubData(subreddits[name]));
      return favorites;
    }, []);
  }

  return {
    favoriteNames,
    favorites,
    locationName,
  };
}

export default connect(mapStateToProps)(QuickNavigation);
