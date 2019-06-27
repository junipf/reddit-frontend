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
      position: { x: 0, y: 0 },
    };
    this.wrapper = React.createRef();
  }
  openDropdown = () => {
    this.setState({
      showDropdown: true,
      position: {
        x: this.wrapper.current.offsetLeft,
        y: this.wrapper.current.offsetTop + this.wrapper.current.clientHeight,
      },
    });
  };
  closeDropdown = () => {
    this.setState({ showDropdown: false });
  };
  handleSelection = value => {
    this.setState({ selection: value });
    if (this.props.onSelection) this.props.onSelection(value);
    this.closeDropdown();
  };
  render() {
    const {
      label,
      children,
      iconAfter,
      toggle,
      hideLabel,
      Select,
    } = this.props;
    const { selection } = this.state;
    const toggleProps = {
      label: Select ? selection || label : label,
      hideLabel: hideLabel,
      onClick: this.state.showDropdown ? this.closeDropdown : this.openDropdown,
      iconAfter: iconAfter ? iconAfter : hideLabel ? "more" : "chevronDown",
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
            position={this.state.position}
            children={children}
            closeDropdown={this.closeDropdown}
            handleSelection={this.handleSelection}
          />
        )}
      </Wrapper>
    );
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.node = React.createRef();
  }
  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }
  handleClick = e => {
    if (this.node.current.contains(e.target)) return;
    else this.props.closeDropdown();
  };
  render() {
    const { position, children } = this.props;
    return (
      <StyledMenu position={position} ref={this.node}>
        {React.Children.map(children, child =>
          React.isValidElement(child) && child.type.name === "Button" ? (
            React.cloneElement(child, {
              size: "fill",
              type: "flat",
              align: "left",
              onSelect: this.props.handleSelection,
            })
          ) : (
            <span>{child}</span>
          )
        )}
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

export const StyledMenu = styled.div.attrs(props => ({
  style: {
    left: props.position.x || 0,
    top: props.position.y || 0,
  },
}))`
  z-index: 100;
  float: left;
  min-width: 8rem;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: white;
  background-clip: padding-box;
  background: ${props => props.theme.container.levels[1]};
  color: ${props => props.theme.container.color[1]};
  border: 1px solid ${props => props.theme.container.border};
  border-radius: 0.25rem;
  position: absolute;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  overflow-x: hidden;
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
  top: 3rem;
  color: ${props => props.theme.container.color[1]};
  background-color: ${props => props.theme.container.levels[1]};
  z-index: 99;
`;
