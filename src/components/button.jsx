import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./icon";

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 500;
  text-align: ${({ align }) => align};
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: ${({ size }) =>
    size === "large"
      ? "0.35em 0.50em"
      : size === "small"
      ? "0.25em 0.45em"
      : size === "fill"
      ? "0.35em 0.75em"
      : "0.35em 0.5em"};
  border: none;
  border-radius: ${({ size }) => (size === "fill" ? "0" : "0.2em")};
  margin: ${({ nomargin, size }) =>
    nomargin
      ? "0"
      : size === "large"
      ? "0.25em 0.5em"
      : size === "small"
      ? "0.0625em 0.125em"
      : "0.125em 0.25em"};
  width: ${({ size }) => (size === "fill" ? "100%" : null)};
  height: ${({ size }) => (size === "fill" ? "100%" : "1.5em")};
  margin-left: 0;
  line-height: 1.25;
  transition: all 0.1s ease;
  text-decoration: none;
  color: ${({ theme, flat, primary, toggle, toggled }) =>
    toggled
      ? theme.primary.text
      : flat
      ? theme.text
      : primary
      ? theme.primary.overlay
      : theme.button.text};
  /* toggled
     ? theme.primary.base
     : flat
     ? primary
       ? toggle && !toggled
         ? theme.button.text
         : theme.primary.text
       : theme.text
     : primary
     ? theme.primary.overlay
     : theme.button.text}; */
  background-color: ${({ theme, flat, primary }) =>
    flat ? "transparent" : primary ? theme.primary.base : theme.button.bg};
  &a {
    color: inherit;
  }
  &a:visited {
    color: inherit;
  }
  &:hover:not(.disabled) {
    cursor: pointer;
    text-decoration: none;
    background-color: ${({ theme, flat, primary }) =>
      primary
        ? flat
          ? transparentize(0.7, theme.primary.base)
          : theme.primary.hover
        : theme.button.hover};
  }
  &:active:not(.disabled) {
    color: ${({ theme, flat, primary }) => (flat ? theme.button.text : null)};
    background-color: ${({ theme, primary }) =>
      primary ? theme.primary.active : theme.button.active};
  }
  &:focus:not(.disabled) {
    outline: 0;
    box-shadow: ${({ size }) => (size === "fill" ? "inset" : null)} 0 0 0 2px
      ${({ theme }) => theme.focus.glow};
  }
  &.disabled {
    opacity: 0.35;
    box-shadow: none;
  }
`;

const Span = styled.span.attrs(({ color }) => ({ style: { color } }))`
  text-decoration: none;
  font-weight: 300;
`;

const Children = styled.div`
  display: flex;
  flex-flow: row nowrap;
  /* text-decoration: none; */
  font-weight: 300;
  font-size: ${({ size }) =>
    size === "large" ? 0.9 : size === "small" ? 0.75 : 0.8}em;
  text-align: ${({ align }) => align};
  color: ${({ primaryText, theme }) =>
    primaryText ? theme.primary.base : null};
  & > * {
    margin-right: 0.5em;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const IconAfter = styled(Icon)`
  margin-left: auto;
`;

const Button = ({
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
  fill,
  nomargin,
  align,
  size,
  onClick,
  value,
  onSelect,
  disabled,
  onCtrlClick,
  onAltClick,
  onShiftClick,
  primaryText,
  primary,
  toggle,
  flat,
  wide,
  toggled,
  ...rest
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    else if (e.ctrlKey && onCtrlClick) onCtrlClick(value);
    else if (e.altKey && onAltClick) onAltClick(value);
    else if (e.shiftKey && onShiftClick) onShiftClick(value);
    else if (onClick) onClick(value);
    else if (onSelect) onSelect(value);
  };

  const selectedChildren = (
    <Children
      size={size}
      align={align ? align : size === "fill" ? "left" : "center"}
      primaryText={primaryText}
    >
      {icon && (
        <Icon icon={icon} color={color} fill={fill} key="0" />
      )}
      {children &&
        React.Children.map(children, (child) =>
          React.isValidElement(child) ? child : <span>{child}</span>
        )}
      {!hideLabel && label && <Span key="2">{label}</Span>}
      {iconAfter && <IconAfter icon={iconAfter} key="3"/>}
    </Children>
  );

  const props = {
    color,
    size,
    toggle: toggle ? "true" : null,
    primary: primary ? "true" : null,
    flat: flat ? "true" : null,
    toggled: toggled && toggled !== "false" ? "true" : null,
    "data-tip-disable": toggled || (!hideLabel && !data_tip),
    "data-tip": data_tip || label,
    children: selectedChildren,
    to: to ? to : null,
    href: href ? href : null,
    as: to ? Link : href ? "a" : null,
    nomargin: nomargin || size === "fill" ? "true" : null,
    onClick: handleClick,
    ...rest,
  };

  return (
    <StyledButton
      {...props}
      className={[
        disabled ? "disabled" : null,
        toggled ? "toggled" : null,
      ].join(" ")}
    />
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["small", "normal", "large", "fill"]),
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
};
Button.defaultProps = {
  size: "normal",
};

export default Button;

export const Group = styled.div`
  margin: 0 0.25rem;
  & > button {
    border-radius: 0;
    margin: 0;
    &:first-of-type {
      border-radius: 0.25rem 0 0 0.25rem;
    }
    &:last-of-type {
      border-radius: 0 0.25rem 0.25rem 0;
    }
    &:focus {
      z-index: 10;
    }
  }
`;
