import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import Button from "./button";
import Dropdown from "./dropdown";

const Overflow = ({ children, label, ...props }) => {
  const refs = useRef([...Array(React.Children.count(children))].fill(null));

  useEffect(() => {
    refs.current = [...Array(React.Children.count(children))].fill(null);
  }, [children]);

  const [overflowChildren, setoverflowChildren] = useState([]);

  return (
    <>
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, { ref: refs[i] })
      )}
      <Dropdown label={label} hideLabel>
        {overflowChildren}
      </Dropdown>
    </>
  );
};

export default Overflow;
