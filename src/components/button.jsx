import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./icon";

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 500;
  text-align: ${props => props.align};
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: ${props =>
    props.size === "large"
      ? "0.5em 0.75em"
      : props.size === "small"
      ? "0.175em 0.25em"
      : props.size === "fill"
      ? "0.35em 0.75em"
      : "0.35em 0.5em"};
  border: none;
  border-radius: ${props => (props.size === "fill" ? "0" : "0.2em")};
  margin: ${props =>
    props.nomargin
      ? "0"
      : props.size === "large"
      ? "0.25em 0.5em"
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
    box-shadow: inset 0 0 0 2px ${props => props.theme.button[props.type].focus};
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

const Children = styled.div`
  display: flex;
  flex-flow: row nowrap;
  text-decoration: none;
  font-weight: 300;
  font-size: ${props => props.size === "large" ? "1em" : "0.8em"};
  /* line-height: 100%; */
  align-items: center;
  & > * {
    margin-right: 0.5em;
    &:last-child {
      margin-right: 0;
    }
  }
  & > span {
    /* height: 1em; */
  }
`;

const IconAfter = styled(Icon)`
  float: right;
`;

export default class Button extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(["flat", "primary", "secondary"]),
    size: PropTypes.oneOf(["small", "normal", "large", "fill"]),
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
  };
  static defaultProps = {
    type: "secondary",
    size: "normal",
  };
  handleClick = () => {
    const { onClick, value, setSelection } = this.props;
    if (onClick) {
      if (value) onClick(value);
      else onClick();
    }
    if (setSelection && value) {
      setSelection(value);
    }
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
      onClick,
      value,
      setSelection,
      ...rest
    } = this.props;

    const selectedChildren = (
      <Children size={this.props.size}>
        {icon && <Icon icon={icon} key="0" />}
        {children &&
          React.Children.map(children, child =>
            React.isValidElement(child) ? child : <span>{child}</span>
          )}
        {!hideLabel && label && <Span key="2">{label}</Span>}
        {iconAfter && <IconAfter icon={iconAfter} key="3" />}
      </Children>
    );

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
