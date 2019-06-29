import React from "react";
import { connect } from "react-redux";
import { setPrefDarkTheme } from "../store/actions";

import Dropdown from "./dropdown";
import Button from "./button";

class PrefMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkSystem: false,
      useSystemPref: true,
    };
  }
  componentWillMount() {
    const DarkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setState({ darkSystem: DarkSystemTheme.matches });
    DarkSystemTheme.addListener(this.handleSystemThemeChange);
  }
  componentWillUnmount() {
    window.matchMedia("(prefers-color-scheme: dark)").removeListener(this.handleSystemThemeChange);
  }
  handleSystemThemeChange = e => {
    this.setState({ darkSystem: e.matches });
    if (this.state.useSystemPref) this.props.setPrefDarkTheme(e.matches);
  };
  handleUserThemeChange = value => {
    if (value === "system") this.props.setPrefDarkTheme(this.state.darkSystem);
    if (value === "light") this.props.setPrefDarkTheme(false);
    if (value === "dark") this.props.setPrefDarkTheme(true);

    this.setState({ useSystemPref: value === "system" });
  };
  render() {
    const { prefDarkTheme } = this.props;
    const { darkSystem, useSystemPref } = this.state;
    return (
      <Dropdown label="Preferences">
        <Dropdown
          select
          label="Theme"
          icon={prefDarkTheme ? "moon" : "sun"}
          {...this.props}
        >
          <Button
            onClick={this.handleUserThemeChange}
            value="light"
            label="Light"
            icon="sun"
            type={!prefDarkTheme && !useSystemPref ? "primary" : "flat"}
          />
          <Button
            onClick={this.handleUserThemeChange}
            value="dark"
            label="Dark"
            icon="moon"
            type={prefDarkTheme && !useSystemPref ? "primary" : "flat"}
          />
          <Button
            onClick={this.handleUserThemeChange}
            value="system"
            label="System"
            icon={darkSystem ? "moon" : "sun"}
            type={useSystemPref ? "primary" : "flat"}
          />
        </Dropdown>
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  const { prefDarkTheme } = state;

  return {
    prefDarkTheme,
  };
}

export default connect(
  mapStateToProps,
  { setPrefDarkTheme }
)(PrefMenu);
