import React, { useState, useRef } from "react";
import styled from "styled-components";
import Button from "./button";
import Icon from "./icon";

const Input = ({
  autofocus,
  onClear,
  clear,
  submit,
  dropdown,
  children,
  size,
  wide,
  before,
  ...props
}) => {
  const [focused, setFocused] = useState(autofocus);
  const focus = () => setFocused(true);
  const blur = () => setFocused(false);
  const $input = useRef(null);

  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  const handleClear = () => {
    if (onClear) onClear();
    else {
      setter.call($input.current, "");
      $input.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return (
    <StyledInput className={focused ? "focus" : null} size={size} wide={wide}>
      {before}
      <input {...props} ref={$input} onFocus={focus} onBlur={blur} />
      {children}
      {clear ? (
        <Button onClick={handleClear} flat>
          <Icon icon="x" />
        </Button>
      ) : null}
    </StyledInput>
  );
};

export const StyledInput = styled.div`
  display: inline-flex;
  flex-flow: row nowrap;
  font-size: ${({size}) => (size === "large" ? "1em" : "0.8em")};
  margin: 0.25em;
  line-height: 1;
  color: ${({theme}) => theme.input.text};
  background-color: ${({theme}) => theme.input.background};
  border: 1px solid ${({theme}) => theme.input.border};
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: ${({wide}) => (wide ? "100%" : "auto")};
  & > input {
    background: transparent;
    border: none;
    margin: 0;
    flex: 1 1 100%;
    height: auto;
    padding: ${({size}) =>
      size === "large" ? "0.5rem 1rem" : "0.375rem 0.75rem"};
    padding-left: 0;
    color: inherit;
  }
  & > button {
    width: auto;
    height: auto;
    &:last-of-type {
      border-bottom-right-radius: 0.35rem;
      border-top-right-radius: 0.35rem;
    }
  }
  &.focus, &:focus {
    outline: 0;
    border-color: ${({theme}) => theme.focus.border};
    box-shadow: 0 0 0 0.2rem ${({theme}) => theme.focus.glow};
  }
`;

export default Input;
