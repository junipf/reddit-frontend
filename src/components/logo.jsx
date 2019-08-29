import React from "react";
import styled from "styled-components";

const LogoWrapper = styled.span`
  width: ${({large}) => large ? "2rem" : "1em"};
  height: ${({large}) => large ? "2rem" : "1em"};
`;

const Logo = ({ color = "#24A0ED", large }) => (
  <LogoWrapper>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 64 64"
      style={{ enableBackground: "new 0 0 64 64" }}
      className="logo"
    >
      <defs>
        <clipPath id="clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip)">
        <circle fill={color} cx="32" cy="32" r="32" />
        <path
          fill="#000"
          d="M3.9,78.1c-8.6-17,2.9-40.1,25.5-51.4l5.4,10.7C18.3,45.7,9.1,61.9,14.6,72.7L3.9,78.1z"
        />
        <circle fill="#fff" cx="32" cy="32.1" r="20" />
        <polygon
          fill="#FF4500"
          points="37.3,44.5 26.7,44.5 26.7,35.3 19.5,35.3 32,19.5 44.5,35.3 37.3,35.3"
        />
      </g>
    </svg>
  </LogoWrapper>
);

export default Logo;
