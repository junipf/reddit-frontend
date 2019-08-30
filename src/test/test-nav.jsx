import React from "react";
import { tests } from "../test";
import Icon from "../components/icon";
import Button from "../components/button";
import Dropdown from "../components/dropdown";

const TestNav = ({ location: { pathname }, match: { params } }) =>
  process.env.NODE_ENV === "development" ? (
    <Dropdown
      label={tests[params.test].name || "tests"}
      icon={tests[params.test].icon || "code"}
    >
      {Object.entries(tests).map(([key, { name, icon }]) => {
        const path = `/test/${name.toLowerCase().replace(/ /g, "-")}`;
        return (
          <Button
            to={path}
            key={name}
            flat
            primary
            toggle
            toggled={path === pathname}
          >
            <Icon icon={icon} />
            {name}
          </Button>
        );
      })}
    </Dropdown>
  ) : null;

export default TestNav;
