import React from "react";
import { tests } from "../test";
import Icon from "../components/icon";
import Button from "../components/button";
import Dropdown from "../components/dropdown";
import { withRouter } from "react-router-dom";

const TestNav = ({ location: { pathname } }) => {
  const buttons = tests.map(({ name, icon }) => {
    const path = `/test/${name.toLowerCase()}`;
    return (
      <Button
        to={path}
        key={name}
        type={path === pathname ? "primary" : "secondary"}
      >
        <Icon icon={icon} />
        {name}
      </Button>
    );
  });

  return process.env.NODE_ENV === "development" ? (
    pathname.startsWith("/test/") ? (
      buttons
    ) : (
      <Dropdown label="Tests" icon="code" hideLabel iconAfter="none">
        {buttons}
      </Dropdown>
    )
  ) : null;
};

export default withRouter(TestNav);
