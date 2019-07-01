import React from "react";
import styled from "styled-components";
import Button from "./button";
import { Link } from "react-router-dom";

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      selection: props.placeholder,
    };
    this.wrapper = React.createRef();
  }
  openDropdown = () => {
    this.setState({ showDropdown: true });
  };
  closeDropdown = () => {
    this.setState({ showDropdown: false });
  };
  setSelection = value => {
    this.setState({ selection: value });
    this.closeDropdown();
  };
  render() {
    const {
      label,
      children,
      icon,
      iconAfter,
      toggle,
      hideLabel,
      Select,
      sub,
      size,
      parentMenu,
    } = this.props;
    const { selection } = this.state;
    const toggleProps = {
      label: Select ? selection || label : label,
      hideLabel: hideLabel,
      onClick: this.state.showDropdown ? this.closeDropdown : this.openDropdown,
      icon: icon ? icon : null,
      iconAfter: iconAfter
        ? iconAfter
        : sub
        ? "chevronRight"
        : hideLabel
        ? "more"
        : "chevronDown",
      size: sub ? "fill" : size,
    };
    return (
      <Wrapper ref={this.wrapper}>
        {React.isValidElement(toggle) ? (
          React.cloneElement(toggle, toggleProps)
        ) : (
          <Button {...toggleProps} />
        )}

        {this.state.showDropdown && (
          <Menu
            closeDropdown={this.closeDropdown}
            setSelection={this.setSelection}
            sub={sub}
            wrapper={this.wrapper}
            parentMenu={parentMenu}
          >
            {children}
          </Menu>
        )}
      </Wrapper>
    );
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rect: { x: 0, y: 0 },
    };
    this.menu = React.createRef();
  }
  componentDidMount() {
    // Wrapper (contains dropdown toggle button)
    // Menu (the actual menu being positioned)
    const { sub } = this.props;
    const {
      clientWidth: menuWidth,
      // clientHeight: menuHeight,
    } = this.menu.current;
    const bodyWidth = document.body.clientWidth;
    const {
      left,
      right,
      top,
      width,
      height,
    } = this.props.wrapper.current.getBoundingClientRect();
    console.log(this.props.wrapper.current);

    const overflowRight = left + width + menuWidth > bodyWidth;
    if (sub) {
      if (overflowRight) {
        this.setState({
          rect: {
            left: -width,
            top: "calc(" + this.props.wrapper.current.offsetTop + "px - 0.5em - 2px)",
          },
        });
      } else {
        this.setState({
          rect: {
            left: width,
            top: "calc(" + this.props.wrapper.current.offsetTop + "px - 0.5em - 2px)",
          },
        });
      }
    } else {
      if (overflowRight) {
        this.setState({
          rect: {
            left: right - menuWidth,
            top: top + height,
          },
        });
      } else {
        this.setState({
          rect: {
            left,
          },
        });
      }
    }
  }
  componentWillMount() {
    document.addEventListener("click", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }
  handleClick = e => {
    if (this.menu.current.contains(e.target)) return;
    this.props.closeDropdown();
  };
  render() {
    const { children, setSelection, sub } = this.props;
    return (
      <StyledMenu rect={this.state.rect} sub={sub} ref={this.menu}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            if (child.type.name === "Button") {
              return React.cloneElement(child, {
                size: "fill",
                type: child.props.type || "flat",
                align: "left",
                setSelection: setSelection,
              });
            }
            if (child.type.name === "Dropdown") {
              return React.cloneElement(child, {
                size: "fill",
                type: child.props.type || "flat",
                align: "left",
                sub: true,
                setSelection: setSelection,
                hideLabel: false,
                parentMenu: this.menu,
              });
            }
          }
          return <span>{child}</span>;
        })}
      </StyledMenu>
    );
  }
}

const Wrapper = styled.div`
  /* width: 0; */
  display: inline-block;
`;

const StyledEntry = styled(Button)`
  border-radius: 0;
  margin: 0;
  width: 100%;
`;

export class Entry extends React.Component {
  handleClick() {
    this.props.onClick();
    this.props.closeDropdown();
  }
  render() {
    return <StyledEntry {...this.props} onClick={this.handleClick} />;
  }
}

export const LinkEntry = styled(Link)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
  line-height: 1;
  padding: 0.5rem 0.75rem;
  transition: box-shadow 0.15s ease-in-out;
  color: ${props => props.theme.button.flat.color[1]};
  background-color: ${props => props.theme.button.flat.levels[0]};
  &:hover {
    background-color: ${props => props.theme.button.flat.levels[1]};
    text-decoration: none;
    color: currentColor;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem ${props => props.theme.button.flat.focus};
  }
`;

export const StyledMenu = styled.div.attrs(props => {
  if (props.rect)
    return {
      style: {
        width: props.rect.width,
        minHeight: props.rect.height,
        left: props.rect.left,
        top: props.rect.top,
      },
    };
})`
  z-index: 100;
  float: left;
  min-width: 8rem;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: inherit;
  background-clip: padding-box;
  background: ${props => props.theme.container.levels[1]};
  color: ${props => props.theme.container.color[1]};
  border: 1px solid ${props => props.theme.container.border};
  border-radius: 0.25rem;
  position: absolute;
  /* width: ${props => (props.sub ? "100%" : "unset")}; */
  /* height: ${props => (props.sub ? "100%" : "unset")}; */
  max-height: calc(100vh - 3rem);
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  scrollbar-width: thin;
  padding: 0.5em 0;
  display: flex;
  flex-flow: column nowrap;
  scrollbar-color: ${props => props.theme.scrollbar};
`;

export const Search = styled.div`
  padding: 0.5rem;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: ${props => props.theme.container.levels[1]};
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  line-height: 1.25;
  color: ${props => props.theme.input.color};
  background-color: ${props => props.theme.input.background};
  border: 1px solid ${props => props.theme.input.border};
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    outline: 0;
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: 0 0 0 0.2rem ${props => props.theme.input.focus};
  }
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
  top: 0;
  color: ${props => props.theme.container.color[1]};
  background-color: ${props => props.theme.container.levels[1]};
  z-index: 99;
`;
