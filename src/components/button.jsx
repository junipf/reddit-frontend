import React from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./icon";

export const buttonMargin = css`
  margin: ${({ kiss, fill, size }) =>
    kiss || fill
      ? "0"
      : size === "small"
      ? "0.0625em 0.125em"
      : "0.125em 0.25em"};
  .button ~ &,
  & ~ & {
    margin-left: 0;
  }
`;

// (({ align, primary, flat, to, href, children, ...props }) =>
//   to ? (
//     <Link to={to} {...props}>
//       {children}
//     </Link>
//   ) : href ? (
//     <a href={href} {...props}>
//       {children}
//     </a>
//   ) : (
//     <button {...props}>{children}</button>
//   )
// )

const StyledButton = styled.button`
  ${buttonMargin};
  display: inline-block;
  font-weight: 500;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: ${({ wide }) => wide ? "0 0.25em" : 0};
  border: none;
  border-radius: ${({ fill }) => (fill ? "0" : "0.2em")};
  width: ${({ fill }) => (fill ? "100%" : null)};
  height: ${({ fill }) => (fill ? "100%" : "1.5em")};
  line-height: 1.25;
  transition: all 0.1s ease;
  text-decoration: none;
  color: ${({ theme, flat, primary, toggled }) =>
    toggled
      ? theme.primary.text
      : flat
      ? theme.text
      : primary
      ? theme.primary.overlay
      : theme.button.text};
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
    box-shadow: ${({ fill }) => (fill ? "inset" : null)} 0 0 0 2px
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
  margin: ${({ size, fill }) =>
    fill
      ? "0.35em 0.75em"
      : size === "large"
      ? "0.35em 0.50em"
      : size === "small"
      ? "0.25em 0.45em"
      : "0.35em 0.62em"};
  display: flex;
  flex-flow: row nowrap;
  font-weight: 300;
  font-size: ${({ size }) =>
    size === "large" ? 0.9 : size === "small" ? 0.75 : 0.8}em;
  justify-content: ${({ align, fill }) => (fill ? "left" : align)};
  align-items: center;
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
  children,
  "data-tip": data_tip,
  "data-tip-disabled": data_tip_disabled,
  // "data-multiline": data_tip_multiline,
  disabled,
  fillIcon,
  hideLabel,
  href = null,
  icon,
  iconAfter,
  label,
  onAltClick,
  onClick,
  onCtrlClick,
  onSelect,
  onShiftClick,
  to = null,
  value,
  wide,
  align = "center",
  fill,
  primary,
  flat,
  toggled,
  size = "normal",
  noMargin,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    else if (e.ctrlKey && onCtrlClick) onCtrlClick(value);
    else if (e.altKey && onAltClick) onAltClick(value);
    else if (e.shiftKey && onShiftClick) onShiftClick(value);
    else if (onClick) onClick(value);
    else if (onSelect) onSelect(value);
  };

  return (
    <StyledButton
      {...props}
      as={to ? Link : href ? "a" : null}
      data-tip={data_tip || label}
      data-tip-disable={
        data_tip_disabled || toggled || (!hideLabel && !data_tip)
      }
      // data-multiline={data_tip_multiline}
      onClick={handleClick}
      href={href}
      to={to}
      fill={fill ? "true" : null}
      primary={primary ? "true" : null}
      flat={flat ? "true" : null}
      wide={wide ? "true" : null}
      align={align}
      kiss={noMargin ? "true" : null}
      size={size}
      className={[
        "button",
        disabled ? "disabled" : null,
        toggled === true ? "toggled" : toggled === false ? "toggled-off" : null,
      ].join(" ")}
    >
      <Children align={align} fill={fill ? "true" : null} size={size}>
        {icon ? (
          <Icon icon={icon} color={props.color} fill={fillIcon} key="0" />
        ) : null}
        {children
          ? React.Children.map(children, (child) =>
              React.isValidElement(child) ? child : <span>{child}</span>
            )
          : null}
        {!hideLabel && label && <Span key="2">{label}</Span>}
        {iconAfter && <IconAfter icon={iconAfter} key="3" />}
      </Children>
    </StyledButton>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["small", "normal", "large"]),
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
};

export default Button;

export const Group = styled.li`
  width: ${({ fill }) => (fill ? "100%" : "auto")};
  margin: 0 0.25rem;
  display: ${({ fill }) => (fill ? "inline-block" : "flex")};
  flex-flow: row nowrap;
  & > .button {
    flex: 1 1 auto;
    text-align: center;
    border-radius: 0;
    margin: 0;
    display: inline-block;
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
