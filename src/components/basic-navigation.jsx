import React from "react";
import Button from "./button";
import { withRouter } from "react-router-dom";

const BasicNavigation = ({ location: { name = "" } = {}, inList }) => {
  let locations = [
    {
      label: "Frontpage",
      icon: "home",
      description: "Your joined communities",
      to: "/",
    },
    {
      label: "r/Popular",
      icon: "trendingUp",
      description: "Reddit's most active communities",
      to: "/r/Popular",
    },
    {
      label: "r/all",
      icon: "barChart2",
      description: "All communities of reddit",
      to: "/r/All",
    },
    // {
    //   label: "Subscriptions",
    //   icon: "list",
    //   description: "View your subscriptions",
    //   to: "/subscriptions/",
    // },
    // {
    //   label: "Search",
    //   icon: "search",
    //   description: "Search for communities, posts, etc",
    //   to: "/search",
    // },
  ];

  if (process.env.NODE_ENV === "development")
    locations.push({
      label: "Test",
      icon: "code",
      description: "Test pages",
      to: "/test/components",
    });

  return (
    <>
      {locations.map(({ icon, label, description, to }) => (
        <Button
          key={label}
          icon={icon}
          label={label}
          hideLabel={!inList}
          // data-tip-disabled={inList}
          data-tip={(!inList ? `${label} <br /> ` : "") + description}
          data-place={inList ? "right" : "bottom"}
          data-multiline={true}
          data-delay-show="0"
          to={to}
          toggled={name.toLowerCase().startsWith(to.toLowerCase())}
          fill={inList ? "true" : null}
          primary
          flat
        />
      ))}
    </>
  );
};

export default withRouter(BasicNavigation);
