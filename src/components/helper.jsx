import React from "react";
import Icon from "./icon";
import styled from "styled-components";

const StyledHelper = styled(Icon)`
color: ${props => props.theme.tag[props.type]}
  margin-left: 0.25em;
  opacity: 0.8;
  position: relative;
  &:hover {
    opacity: 1;
  }
`;

const Helper = ({ icon = "help", ...props }) => (
  <StyledHelper icon={icon} {...props} />
);

export default Helper;
