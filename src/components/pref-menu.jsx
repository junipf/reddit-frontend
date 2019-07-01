import React from "react";
import { connect } from "react-redux";
import { setUseSystemTheme, setUserPrefs } from "../store/actions";
import { Requester } from "../components/requester";

import Dropdown from "./dropdown";
import Button from "./button";

class PrefMenu extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      darkSystem: false,
    };
  }
  componentWillMount() {
    const DarkSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    this.setState({ darkSystem: DarkSystemTheme.matches });
    DarkSystemTheme.addListener(this.handleSystemThemeChange);
  }
  componentWillUnmount() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeListener(this.handleSystemThemeChange);
  }
  handleSystemThemeChange = e => {
    const {
      setUserPrefs,
      useSystemTheme,
    } = this.props;
    
    this.setState({ darkSystem: e.matches });
    if (useSystemTheme) 
      this.context
        .updatePreferences({ nightmode: e.matches })
        .then(result => setUserPrefs(result));
  };
  handleUserThemeChange = value => {
    const {
      setUseSystemTheme,
      setUserPrefs,
      useSystemTheme,
      userPrefs,
    } = this.props;
    
    if (value === "system") {
      if (!useSystemTheme) setUseSystemTheme(true);
    } else {
      if (useSystemTheme) setUseSystemTheme(false);
    }
    
    const nightmode = value === "dark" || (value === "system" && this.state.darkSystem);
    if (userPrefs.nightmode !== nightmode)
      this.context
          .updatePreferences({ nightmode })
          .then(result => setUserPrefs(result));
  };
  render() {
    const { useSystemTheme, userPrefs: { nightmode } = {}} = this.props;
    const { darkSystem } = this.state;
    return (
      <Dropdown label="Preferences">
        <Button label="Messages" icon="mail" to="/messages/" />
        <Button label="Profile" icon="user" to="/user/me" />
        <Button label="Hexagon" icon="hexagon" />
        <Button label="Coffee" icon="coffee" />
        <Button label="Pin" icon="pin" />
        <Dropdown
          select
          label="Theme"
          icon={nightmode ? "moon" : "sun"}
          {...this.props}
        >
          <Button
            onClick={this.handleUserThemeChange}
            value="light"
            label="Light"
            icon="sun"
            type={!useSystemTheme && !nightmode  ? "primary" : "flat"}
          />
          <Button
            onClick={this.handleUserThemeChange}
            value="dark"
            label="Dark"
            icon="moon"
            type={!useSystemTheme && nightmode ? "primary" : "flat"}
          />
          <Button
            onClick={this.handleUserThemeChange}
            value="system"
            label="System"
            icon="cog"
            iconAfter={darkSystem ? "moon" : "sun"}
            type={useSystemTheme ? "primary" : "flat"}
          />
        </Dropdown>
        <Button label="Log out" icon="logout" />
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  const { useSystemTheme, userPrefs } = state;
  return {
    useSystemTheme,
    userPrefs,
  };
}

export default connect(
  mapStateToProps,
  { setUseSystemTheme, setUserPrefs }
)(PrefMenu);
