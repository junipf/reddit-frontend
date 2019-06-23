import React from "react";
import Button from "./button";

export default class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggled: props.startOn };
  }
  callback = () => {
    const { onToggleOn, onToggleOff, onToggle, onClick } = this.props;

    if (this.state.toggled && onToggleOn) onToggleOn();
    else if (!this.state.toggled && onToggleOff) onToggleOff();
    else if (onToggle) onToggle();
    else if (onClick) onClick();
  };
  handleClick = () => {
    this.setState({ toggled: !this.state.toggled }, this.callback());
  };
  render() {
    const {
      onToggleOn,
      onToggleOff,
      onToggle,
      onClick,
      iconOn = "toggleon",
      iconOff = "toggleoff",
      colorOn,
      colorOff,
      labelOn,
      labelOff,
      label,
      icon,
      type,
      ...rest
    } = this.props;
    const { toggled } = this.state;
    return (
      <Button
        type={type}
        color={
          toggled ? (colorOn ? colorOn : null) : colorOff ? colorOff : null
        }
        icon={icon ? icon : toggled ? iconOn : iconOff}
        onClick={this.handleClick}
        label={label ? label : toggled ? labelOn : labelOff}
        {...rest}
      />
    );
  }
}
