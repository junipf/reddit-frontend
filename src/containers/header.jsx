import React from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router-dom";
import NavigationMenu from "../components/navigation-menu";
import PrefMenu from "./pref-menu";
import TestNav from "../test/test-nav";
import SearchBar from "./search-bar";
import Settings from "./settings";
import { routes } from "./app";

export default ({ authURL, logout, ...props }) => {
  const allRoutes = [
    ...routes.user,
    ...routes.search,
    ...routes.listing,
    "/:page?",
  ];
  return (
    <Header>
      <Section>
        <Route path={allRoutes} component={NavigationMenu} />
        <Switch>
          <Route path="/test/:test" component={TestNav} />
          <Route
            path={[
              ...routes.user,
              ...routes.search,
              ...routes.listing,
              "/:page?",
            ]}
            component={Settings}
          />
        </Switch>
      </Section>
      <Section>
        <Route path={allRoutes} component={SearchBar} />
        <PrefMenu authURL={authURL} logout={logout} />
      </Section>
    </Header>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: inherit;
  align-items: center;
  height: inherit;
  z-index: 10;
  flex: 1 1 50%;
  position: relative;
`;

const Header = styled.header`
  width: 100%;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme?.header?.border};
  background-color: ${({ theme }) => theme?.header?.bg};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 0 0 auto;
  opacity: 1;
  position: relative;
  z-index: 100;
  font-size: 1.1em;
  height: 3rem;
  padding: 0 0.25rem;
  & > ${Section} {
    justify-content: start;
    &:last-of-type {
      justify-content: end;
    }
  }
`;
