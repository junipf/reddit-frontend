import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import Button from "./button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Dropdown = ({
  children,
  icon,
  iconAfter,
  toggle,
  hideLabel,
  sub,
  size,
  placeholder,
  onSelect,
  expand,
  open,
  up,
  down,
  left,
  right,
  center,
  ...rest
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const debugLogChildren = () => console.log(children);

  const toggleDropdown = () => setShowDropdown((bool) => !bool);
  const closeDropdown = () => setShowDropdown(false);

  const dir = {
    x: left ? "left" : right ? "right" : center ? null : "right",
    y: up ? "up" : down ? "down" : center ? null : "down",
  };

  let props = {
    hideLabel: hideLabel,
    onClick: toggleDropdown,
    onAltClick:
      process.env.NODE_ENV === "development" ? debugLogChildren : null,
    icon: icon ? icon : dir.x === "left" && !dir.y ? "chevronLeft" : null,
    iconAfter: iconAfter
      ? iconAfter === "none"
        ? undefined
        : iconAfter
      : sub || (dir.x === "right" && !dir.y)
      ? "chevronRight"
      : !icon && dir.x === "left" && !dir.y
      ? null
      : dir.y === "up"
      ? "chevronUp"
      : !dir.x && !dir.y
      ? "moreHorizontal"
      : "chevronDown",
    size: sub ? "fill" : size ? size : undefined,
    ...rest,
  };

  if (toggle && React.isValidElement(toggle)) {
    props = { ...props, ...toggle.props };
  }

  const useToggle = React.isValidElement(toggle) ? (
    React.cloneElement(toggle, props)
  ) : (
    <Button {...props} />
  );

  const wrapper = useRef(null);

  return (
    <Wrapper ref={wrapper} size={props.size}>
      {useToggle}
      {showDropdown || open ? (
        <Menu
          onSelect={onSelect}
          closeDropdown={closeDropdown}
          showDropdown={showDropdown}
          sub={sub || (dir.x && !dir.y)}
          expand={expand}
          wrapper={wrapper}
          dir={dir}
          toggle={useToggle}
          items={children}
        >
          {expand ? useToggle : null}
          {children}
        </Menu>
      ) : null}
    </Wrapper>
  );
};

Dropdown.propTypes = {
  direction: PropTypes.oneOf(["left", "up", "right", "down"]),
};

export default Dropdown;

const Menu = ({
  children,
  onSelect,
  sub,
  closeDropdown,
  wrapper,
  dir,
  expand,
  toggle,
}) => {
  const menu = useRef(null);
  const [pos, setPos] = useState({
    init: false,
    left: null,
    top: null,
  });
  const [subMenuPositioning, setSubMenuPositioning] = useState("right");

  useLayoutEffect(() => {
    if (pos.init) return;
    const { clientWidth: menuWidth, clientHeight: menuHeight } = menu.current;
    const { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
    const button = wrapper.current.getBoundingClientRect();

    const overflow = {
      right: button.left + button.width + menuWidth > bodyWidth,
      left: button.right + button.width + menuWidth > bodyWidth,
      top: button.bottom + button.height + menuHeight > bodyHeight,
      bottom: button.top + button.height + menuHeight > bodyHeight,
    };

    const h = {
      left: button.width - menuWidth,
      center: -(menuWidth / 2) + button.width / 2,
      right: null,
    };
    const v = {
      up: -menuHeight,
      center: -(menuHeight / 2) + button.height / 2,
      down: null,
    };

    setPos({
      top:
        sub || expand
          ? null
          : !dir.y
          ? v.center
          : overflow.bottom || dir.y === "up"
          ? v.up
          : v.down,
      left: sub
        ? dir.x === "left"
          ? -menuWidth
          : button.width
        : !dir.x
        ? h.center
        : overflow.right || dir.x === "left"
        ? h.left
        : h.right,
    });

    if (overflow.right || dir.x === "left") setSubMenuPositioning("left");

    // setPos(newPos);
  }, [wrapper, sub, expand, dir, pos.init]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menu.current && menu.current.contains(e.target)) return;
      closeDropdown();
    };

    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  });

  const selectAndClose = (value) => {
    onSelect && onSelect(value);
    closeDropdown();
  };

  const useChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === Button)
        return (
          <li>
            {React.cloneElement(child, {
              size: "fill",
              type: child.props.type === "primary" ? "primary" : "flat",
              hideLabel: false,
              align: "left",
              onSelect: selectAndClose,
            })}
          </li>
        );
      if (child.type === Dropdown)
        return (
          <li>
            {React.cloneElement(child, {
              size: "fill",
              type: child.props.type ? child.props.type : "flat",
              align: "left",
              sub: true,
              left: subMenuPositioning === "left",
              right: subMenuPositioning === "right",
              onSelect: selectAndClose,
              hideLabel: false,
            })}
          </li>
        );
      return <li>{child}</li>;
    }
    if (child)
      return (
        <li>
          <CategoryTitle>{child}</CategoryTitle>
        </li>
      );
    return child;
  });

  return (
    <StyledMenu pos={pos} sub={sub} ref={menu} expand={expand}>
      {useChildren}
    </StyledMenu>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: ${({size}) => size === "fill" ? "100%" : null};
`;

const StyledEntry = styled(Button)`
  border-radius: 0;
  margin: 0;
  width: 100%;
`;

export const Entry = ({ onClick, closeDropdown, ...props }) => {
  const handleClick = () => {
    onClick();
    closeDropdown();
  };
  return <StyledEntry {...props} onClick={handleClick} />;
};

export const LinkEntry = styled(Link)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
  line-height: 1;
  padding: 0.5rem 0.75rem;
  transition: box-shadow 0.15s ease-in-out;
  color: ${({ theme }) => theme.button.flat.color};
  background-color: ${({ theme }) => theme.button.flat.bg};
  &:hover {
    background-color: ${({ theme }) => theme.button.flat.hover};
    text-decoration: none;
    color: currentColor;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.focus.glow};
  }
`;

const menuPadding = "0.35em";

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin: ${menuPadding} 0;
  border-top: 1px solid ${({ theme }) => theme.card.innerBorder};
`;

export const StyledMenu = styled.ul.attrs(
  ({ pos: { left, top } = {}, sub, expand }) => ({
    style: {
      left: left,
      top: top ? top : sub || expand ? `-${menuPadding}` : null,
    },
  })
)`
  z-index: 100;
  float: left;
  min-width: 8rem;
  max-width: 16rem;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: inherit;
  background-clip: padding-box;

  background: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.color};
  border: 1px solid ${({ theme }) => theme.card.border};
  border-radius: 0.25rem;
  position: absolute;
  max-height: calc(100vh - 3rem);
  scrollbar-width: thin;
  padding: ${menuPadding} 0;
  display: flex;
  flex-flow: column nowrap;
  scrollbar-color: ${({ theme }) => theme.scrollbar};
  overscroll-behavior: contain;
  transition: height 2s ease, width 2s ease, border-color 50ms ease;
`;

export const Search = styled.div`
  padding: 0.35rem;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: inherit;
`;

export const CategoryTitle = styled.div`
  display: flex;
  flex-flow: row nowrap;
  /* justify-content: space-between; */
  padding: 0 0.5rem 0.125rem 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: inherit;
  white-space: nowrap;
  position: sticky;
  top: 2.8rem;
  background-color: inherit;
  z-index: 99;
`;
