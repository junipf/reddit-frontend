import React from "react";
import styled from "styled-components";
import icons from "../icons";
import { PropTypes } from "prop-types";

const IconWrapper = styled.span`
  /* Aligns icons to font */
  position: relative;
  bottom: ${({ inline }) => (inline ? "-0.166em" : "0")};
  /* margin-top: 0; */
  margin-top: ${({ inline }) => (inline ? "0.083em" : "0")};
  /* bottom: ${({ inline }) => (inline ? "-0.083em" : null)}; */
  /* margin-top: ${({ inline }) => (inline ? "-0.083em" : null)}; */
  display: inline-block;
  width: ${({ size }) => (size === "xl" ? "4em" : "1em")};
  height: ${({ size }) => (size === "xl" ? "4em" : "1em")};
  color: ${({ color }) => color || "inherit"};
  margin-right: ${({ marginRight }) => (marginRight ? "0.25em" : "0")};
  svg {
    transform: ${({ rotate }) => (rotate ? "rotate(" + rotate + ")" : null)};
    height: inherit;
    width: inherit;
    stroke-width: ${({ thin }) => (thin ? 1 : null)};
    color: currentColor;
    path {
      fill: ${({ fill, icon }) => fill && icon === "pin" && "currentColor"};
    }
    rect {
      fill: ${({ fill }) => fill && "currentColor"};
    }
    polygon {
      fill: ${({ fill }) => fill && "currentColor"};
    }
  }
`;

const Icon = ({ icon = "info", fill, label, "data-tip": data_tip, ...props }) =>
  icons[icon.toLowerCase()] ? (
    <IconWrapper
      fill={fill ? "true" : undefined}
      icon={icon.toLowerCase()}
      {...props}
      data-tip={data_tip || label}
    >
      {icons[icon.toLowerCase()]}
    </IconWrapper>
  ) : null;
export default Icon;

Icon.propTypes = {
  icon: (props, propName) => {
    if (!(props[propName].toLowerCase() in icons)) {
      return new Error(
        `Invalid icon name '${props[propName]}'. Must be one of: ${Object.keys(
          icons
        )}`
      );
    }
  },
  size: PropTypes.oneOf(["small", "normal", "large", "xl"]),
  inline: PropTypes.bool,
};
