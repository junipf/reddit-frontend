import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./icon";

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 500;
  font-size: 1em;
  text-align: ${props => (props.full ? "left" : "center")};
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: 0.35em 0.5em;
  border: none;
  border-radius: ${props => (props.full ? "0" : "0.2em")};
  margin: ${props => (props.full ? "0" : "0.125em 0.25em")};
  width: ${props => (props.full ? "100%" : null)};
  margin-left: 0;
  line-height: 1;
  transition: all 0.1s ease;
  text-decoration: none;
  color: ${props => props.theme.button[props.type].color[0]};
  background-color: ${props => props.theme.button[props.type].levels[0]};
  &a {
    color: ${props => props.theme.button[props.type].color[0]};
  }
  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: ${props => props.theme.button[props.type].color[1]};
    background-color: ${props => props.theme.button[props.type].levels[1]};
  }
  &:active {
    color: ${props => props.theme.button[props.type].color[2]};
    background-color: ${props => props.theme.button[props.type].levels[2]};
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px ${props => props.theme.button[props.type].focus};
  }
  &:disabled {
    opacity: 0.65;
    box-shadow: none;
  }
`;

const Span = styled.span.attrs(props => ({ style: { color: props.color } }))`
  text-decoration: none;
  font-weight: 300;
`;

export default class Button extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(["flat", "primary", "button"]),
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
  };
  render() {
    const {
      type = "secondary",
      hideLabel,
      showTooltip,
      label,
      icon,
      iconAfter,
      children,
      // fromColor = null,
      // colors,
      to,
      href,
      full,
      "data-tip": data_tip,
      ...rest
    } = this.props;

    // const selectedTheme = fromColor
    //   ? { button: generateButtonColors(fromColor) }
    //   : this.props.theme;

    // const selectedColors =
    //   type === "primary"
    //     ? selectedTheme.button.primary
    //     : type === "flat"
    //     ? selectedTheme.button.flat
    //     : selectedTheme.button.secondary;

    const selectedChildren = [
      icon && <Icon icon={icon} key="0" />,
      children && <Span key="1">{children}</Span>,
      !hideLabel && label && <Span key="2">{label}</Span>,
      iconAfter && <Icon icon={iconAfter} key="3" />,
    ];

    const props = {
      type,
      "data-tip-disable": !hideLabel && !data_tip,
      "data-tip": data_tip || label,
      children: selectedChildren,
      to: to ? to : null,
      href: href ? href : null,
      as: to ? Link : href ? "a" : null,
      full,
      ...rest,
    };
    return <StyledButton {...props} />;
  }
}
