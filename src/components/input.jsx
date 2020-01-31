import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Button from "./button";
import Icon from "./icon";

export default ({
  autofocus,
  size,
  wide,
  before,
  dropdown,
  onClear,
  onSubmit,
  onFocus,
  onBlur,
  children,
  clear,
  submit,
  submitIcon = "search",
  prefix,
  autocomplete,
  value = "",
  onChange,
  forwardRef,
  suggestions = [],
  ...props
}) => {
  const $input = useRef(null);
  const [focused, setFocused] = useState(autofocus);
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e, $styledInput);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSubmit) {
      if (autocomplete && autocomplete !== "") onChange(e);
      else onSubmit(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit($input.current.value);
  };

  const handleClick = (e) => {
    $input.current.focus();
  };

  const handleChange = (e) => {
    if (
      autocomplete &&
      autocomplete !== "" &&
      e.target.value === value + autocomplete
    )
      return;
    onChange(e);
  };

  useEffect(() => {
    console.log($input.current.selectionStart);
    $input.current.setRangeText(
      autocomplete,
      value.length,
      value.length,
      "select"
    );
  }, [value, autocomplete]);

  /* 
  const autocompleteFormat = {
    type: "after", //or "replace"
    text: "string"
  }
  */

  const $styledInput = useRef(null);

  return (
    <StyledInput
      className={focused ? "focus" : null}
      size={size}
      wide={wide}
      ref={$styledInput}
    >
      <Line>
        {before}
        <Text onClick={handleClick}>
          {/* <Prefix prefix={prefix} /> */}
          <Input
            type="search"
            ref={$input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            onChange={handleChange}
            // size={value.length}
            value={value}
            {...props}
          />
        </Text>
        <Controls>
          {clear && value.length > 0 ? (
            <Button onClick={handleClear} flat fill label="Clear" hideLabel>
              <Icon icon="x" />
            </Button>
          ) : null}
          {submit ? (
            <Button
              onClick={handleSubmit}
              flat
              fill
              primary
              wide
              label="Search"
              hideLabel
            >
              <Icon icon={submitIcon} />
            </Button>
          ) : null}
        </Controls>
      </Line>
      {suggestions ? (
        <Suggestions focused={focused}>
          {suggestions.map(({ name }) => (
            <Line>
            <Button fill flat>
              {name}
            </Button>
            </Line>
          ))}
        </Suggestions>
      ) : null}
    </StyledInput>
  );
};

const Suggestions = styled.div`
  /* display: ${({ focused }) => (focused ? "block" : "none")}; */
  height: ${({ focused, children }) =>
    focused ? children.length * 1.5 + "em" : "0"};
  overflow: hidden;
  transition: height 250ms ease;
`;

const Line = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const Input = styled.input`
  background: transparent;
  display: block;
  border: none;
  margin: 0;
  flex: 1 1 auto;
  height: auto;
  color: inherit;
  width: auto;
  caret-color: ${({ theme }) => theme.primary.text};
  ::selection {
    background-color: ${({ theme }) => theme.primary.base};
    color: ${({ theme }) => theme.primary.overlay};
  }
`;

const Text = styled.span`
  padding: ${({ size }) =>
    size === "large" ? "0.5rem 1rem" : "0.375rem 0.75rem"};
  flex: 1 1 100%;
  display: flex;
  flex-flow: row nowrap;
  line-height: 1;
`;

// const Autocomplete = styled.span`
//   flex: 1 1 100%;
// `;

const Controls = styled.span`
  display: flex;
  flex-flow: row nowrap;
`;

const Prefix = styled.span`
  line-height: 1;
  margin: 0.25em -0.25em 0.25em 0.25em;
`;

export const StyledInput = styled.div`
  display: inline-flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  font-size: ${({ size }) => (size === "large" ? "1em" : "0.8em")};
  margin: 0.25em;
  line-height: 1;
  color: ${({ theme }) => theme.input.text};
  background-color: ${({ theme }) => theme.input.background};
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: ${({ wide }) => (wide ? "100%" : "auto")};
  max-width: 75rem;
  & > button {
    width: auto;
    height: auto;
    &:last-of-type {
      border-bottom-right-radius: 0.35rem;
      border-top-right-radius: 0.35rem;
    }
  }
  &.focus,
  &:focus {
    outline: 0;
    border-color: ${({ theme }) => theme.focus.border};
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.focus.glow};
  }
`;
