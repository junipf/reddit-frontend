import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import Dropdown from "../components/dropdown";
import Button from "../components/button";
import { setPostListingSettings } from "./../store/actions";

const PostListingSettings = ({
  postListingSettings: settings,
  setPostListingSettings,
  match: { params: path } = {},
  location: { search },
}) => {
  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  // useEffect(() => {
  //   if (!path.id)
  //     setPostListingSettings({
  //       subName: path.subName || null,
  //       sort: path.sort || "hot",
  //       time: searchParams.get("t") || "all",
  //     });
  // }, [path, searchParams, setPostListingSettings]);

  const goTo = ({ sort = settings.sort, time = settings.time }) =>
    `${settings.subName ? `/r/${settings.subName}` : ""}${
      sort && sort !== "hot" ? `/${sort}` : "/"
    }${
      time && (sort === "controversial" || sort === "top") ? `/?t=${time}` : ""
    }`;

  const TimeDropdown = (sort, label) => {
    return (
      <Dropdown label={label || sort}>
        {["hour", "day", "week", "month", "year", "all"].map((time) => (
          <Button
            key={time}
            label={time}
            to={goTo({ sort, time })}
            primary={settings.time === time}
          />
        ))}
      </Dropdown>
    );
  };

  return settings.visible || true ? (
    <>
      <Dropdown label={settings.sort || "hot"}>
        {["hot", "best", "new", "rising"].map((sort) => (
          <Button
            key={sort}
            label={sort}
            to={goTo({ sort })}
            primary={settings.sort === sort}
          />
        ))}
        {TimeDropdown("controversial")}
        {TimeDropdown("top")}
      </Dropdown>
      {settings.sort === "top" || settings.sort === "controversial"
        ? TimeDropdown(settings.sort, settings.time)
        : null}
    </>
  ) : (
    <Button label="Open post listing" to={goTo({})} />
  );
};

export default connect(
  ({ postListingSettings }) => ({
    postListingSettings,
  }),
  { setPostListingSettings }
)(PostListingSettings);
