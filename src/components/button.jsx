import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./icon";

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 500;
  font-size: 1em;
  text-align: ${props => (props.align)};
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: ${props =>
    props.size === "small" ? "0.1em 0.25em" : "0.35em 0.5em"};
  border: none;
  border-radius: ${props => (props.size === "fill" ? "0" : "0.2em")};
  margin: ${props =>
    props.nomargin
      ? "0"
      : props.size === "small"
      ? "0.0625em 0.125em"
      : "0.125em 0.25em"};
  width: ${props => (props.size === "fill" ? "100%" : null)};
  margin-left: 0;
  line-height: 1;
  transition: all 0.1s ease;
  text-decoration: none;
  color: ${props => props.color || props.theme.button[props.type].color[0]};
  background-color: ${props => props.theme.button[props.type].levels[0]};
  &a {
    color: ${props => props.color || props.theme.button[props.type].color[0]};
  }
  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: ${props => props.color || props.theme.button[props.type].color[1]};
    background-color: ${props => props.theme.button[props.type].levels[1]};
  }
  &:active {
    color: ${props => props.color || props.theme.button[props.type].color[2]};
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
    type: PropTypes.oneOf(["flat", "primary", "secondary"]),
    size: PropTypes.oneOf(["small", "normal", "fill"]),
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
  };
  static defaultProps = {
    type: "secondary",
    size: "normal",
  };
  handleClick = () => {
    const { onClick, onSelection, value, label, children } = this.props;
    if (onSelection) onSelection(value || label || String(children));
    if (onClick) onClick();
  };
  render() {
    const {
      type,
      hideLabel,
      showTooltip,
      label,
      icon,
      iconAfter,
      children,
      // fromColor = null,
      color,
      to,
      href,
      "data-tip": data_tip,
      noMargin,
      align,
      ...rest
    } = this.props;

    const selectedChildren = [
      icon && <Icon icon={icon} marginRight={!hideLabel && label} key="0" />,
      children && <Span key="1">{children}</Span>,
      !hideLabel && label && <Span key="2">{label}</Span>,
      iconAfter && <Icon icon={iconAfter} key="3" />,
    ];

    const props = {
      type,
      color,
      "data-tip-disable": !hideLabel && !data_tip,
      "data-tip": data_tip || label,
      children: selectedChildren,
      to: to ? to : null,
      href: href ? href : null,
      as: to ? Link : href ? "a" : null,
      nomargin: noMargin ? "true" : this.props.size === "fill" ? "true" : null,
      align: align || this.props.size === "fill" ? "left" : "center",
      onClick: this.handleClick,
      ...rest,
    };
    return <StyledButton {...props} />;
  }
}
