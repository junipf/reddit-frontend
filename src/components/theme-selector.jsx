import React from "react";
import { connect } from "react-redux";
import { setPrefDarkTheme } from "../store/actions";

import Dropdown from "./dropdown";
import Button from "./button";

class ThemeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { darkSystem: false };
  }
  componentWillMount() {
    const DarkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setState({ darkSystem: DarkSystemTheme.matches });
    DarkSystemTheme.addListener(this.handleSystemThemeChange);
  }
  handleSystemThemeChange = e => {
    this.setState({ darkSystem: e.matches });
    this.props.setPrefDarkTheme(e.matches);
  };
  handleUserThemeChange = value => {
    this.props.setPrefDarkTheme(value);
  };
  render() {
    const { preferDarkTheme } = this.props;
    const { darkSystem } = this.state;
    return (
      <Dropdown select iconAfter={preferDarkTheme ? "moon" : "sun"}>
        <Button
          onClick={this.handleUserThemeChange}
          value={false}
          label="Light theme"
          icon="sun"
        />
        <Button
          onClick={this.handleUserThemeChange}
          value={true}
          label="Dark theme"
          icon="moon"
        />
        <Button
          onClick={this.handleUserThemeChange}
          value={null}
          label="Use system theme"
          icon={darkSystem ? "moon" : "sun"}
        />
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
)(ThemeSelector);
