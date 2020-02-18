import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { isFragment } from "react-is";
import styled from "styled-components";
import Button, { buttonMargin } from "./button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const Dropdown = ({
  children,
  icon,
  iconAfter,
  toggle,
  label,
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
  noMargin,
  closeOnSelect,
  fill,
  preRender,
  ...rest
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const debugLogChildren = () => console.log(children);

  const toggleDropdown = () => {
    setShowDropdown((bool) => !bool);
    ReactTooltip.rebuild();
  };
  const closeDropdown = () => setShowDropdown(false);

  const dir = {
    x: left ? "left" : right ? "right" : center ? null : "right",
    y: up ? "up" : down ? "down" : center ? null : "down",
  };

  let props = {
    label: label,
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
    size: size ? size : undefined,
    fill: fill || sub,
    toggled: showDropdown,
    noMargin: "true",
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
    <Wrapper
      ref={wrapper}
      size={props.size}
      noMargin={noMargin}
      className="button"
      fill={fill || sub ? "true" : null}
    >
      {useToggle}
      {showDropdown || open || preRender ? (
        <Menu
          preRender={preRender}
          open={open}
          onSelect={onSelect}
          closeOnSelect={closeOnSelect}
          closeDropdown={closeDropdown}
          showDropdown={showDropdown}
          sub={sub || (dir.x && !dir.y)}
          expand={expand}
          wrapper={wrapper}
          dir={dir}
          toggle={useToggle}
          items={children}
          label={hideLabel && label}
          fill={fill || sub ? "true" : null}
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
  closeOnSelect,
  sub,
  closeDropdown,
  wrapper,
  dir,
  expand,
  toggle,
  label,
  preRender,
  showDropdown,
  open,
}) => {
  const $menu = useRef(null);
  const [pos, setPos] = useState({
    init: false,
    left: null,
    top: null,
  });
  const [subMenuPositioning, setSubMenuPositioning] = useState("right");

  useLayoutEffect(() => {
    if (!wrapper.current) return;
    if (pos.init) return;
    const { clientWidth: menuWidth, clientHeight: menuHeight } = $menu.current;
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
  }, [wrapper, sub, expand, dir, pos.init]);

  useEffect(() => {
    const handleClick = (e) => {
      if ($menu.current && $menu.current.contains(e.target)) return;
      closeDropdown();
    };

    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  });

  const selectAndClose = (value) => {
    onSelect && onSelect(value);
    if (closeOnSelect) closeDropdown();
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [])

  // const [focus, setFocus] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // console.log(e);
      if (e.key === "ArrowDown") {
        // console.log("🔽");
        if ($menu.current && $menu.current.contains(e.target)) {

        }
        // setFocus(f => f + 1)
      }
      if (e.key === "ArrowUp") {
        // console.log("🔼");
        // setFocus(f => f - 1)
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  })

  // useEffect(() => {
    // if (!$menu.current || $menu.current.children) return;
    // const items = $menu.current.children;
    // const map = [];
    // const unwrap = (el) => {
    //   if (el.tabIndex !== -1) return el;
    //   if (el.children.length > 0) return unwrap(el);
    //   return null;
    // }
    // items.map((el, i) => map[i] = unwrap(el));

    // console.log(map);

    // if (focus > items.length - 1) items[0].firstChild.focus()
    // else if (focus < 0) items[items.length - 1 ].firstChild.focus()
    // else items[focus].firstChild.focus()
  // }, [focus])

  const mapChildrenByType = (childrenToMap) =>
    React.Children.map(childrenToMap, (child) => {
      if (React.isValidElement(child)) {
        if (isFragment(child)) return mapChildrenByType(child.props.children);
        if (child.type === "li") return child;
        if (child.type === Button)
          return (
            <li>
              {React.cloneElement(child, {
                fill: true,
                // type: child.props.type === "primary" ? "primary" : "flat",
                flat: true,
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
                fill: true,
                // type: child.props.type ? child.props.type : "flat",
                flat: true,
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
    <StyledMenu pos={pos} sub={sub} ref={$menu} expand={expand} open={open || showDropdown} preRender={preRender}>
      {label ? (
        <li>
          <CategoryTitle>{label}</CategoryTitle>
        </li>
      ) : null}
      {mapChildrenByType(children)}
    </StyledMenu>
  );
};

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: ${({ fill }) => (fill ? "100%" : null)};
  ${buttonMargin};
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
  padding: 0.5rem 0.8rem;
  transition: box-shadow 0.15s ease-in-out;
  color: ${({ theme }) => theme.button.text};
  background-color: ${({ theme }) => theme.button.bg};
  &:hover {
    background-color: ${({ theme }) => theme.button.hover};
    text-decoration: none;
    color: currentColor;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.focus.glow};
  }
`;

const menuPadding = 0.35; //em

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin: ${menuPadding}em 0;
  border-top: 1px solid ${({ theme }) => theme.card.innerBorder};
`;

export const StyledMenu = styled.ul.attrs(
  ({ pos: { left, top } = {}, sub, expand, open, preRender }) => ({
    style: {
      left: left,
      top: top ? top : sub || expand ? `-${menuPadding}em` : null,
      display: preRender && !open ? "none" : open ? "flex" : "flex",
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
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.card.border};
  border-radius: 0.25rem;
  position: absolute;
  max-height: calc(100vh - 3rem);
  scrollbar-width: thin;
  padding: ${menuPadding}em 0;
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
  padding: 0 1em ${menuPadding}em 1em;
  margin-bottom: ${menuPadding}em;
  background: ${({ theme }) => theme.card.bg};
  border-bottom: 1px solid ${({ theme }) => theme.card.innerBorder};
  font-size: 0.75em;
  color: inherit;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 99;
`;
