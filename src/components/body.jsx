import React from "react";
import styled from "styled-components";
import Toggle from "./toggle";

const Text = styled.div`
  padding: 0 0.5rem 1rem 0.5rem;
  position: relative;
  overflow: hidden;
  height: ${props => (props.overflow && !props.showAll ? "100px" : "unset")};
  transition: height 0.1s ease;
  &:after {
    display: ${props => (props.overflow && !props.showAll ? "block" : "none")};
    content: "";
    width: 100%;
    height: 2rem;
    background: ${props =>
      "linear-gradient(transparent 0%, " + props.theme.container.levels[1] + " 90%)"};
    position: absolute;
    bottom: 0;
    left: 0;
  }
  a {
    color: ${props=>props.theme.container.link};
    text-decoration: underline;
  }
`;

const Actions = styled.div`
  width: 100%;
  text-align: center;
  /* padding: 0.25rem; */
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0.9;
  overflow: visible;
`;

const Wrapper = styled.div`
  overflow: visible;
`;

export class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overflow: false,
      showAll: false,
    };
    this.body = React.createRef();
  }
  componentDidMount() {
    if (this.props.inListing)
      this.setState({ overflow: this.body.current.clientHeight >= 130 });
    else
      this.setState({ showAll: true });
  }
  toggleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };
  render() {
    const { overflow, showAll } = this.state;
    return (
      <Wrapper>
        <Text
          ref={this.body}
          overflow={overflow ? "true" : null}
          showAll={showAll ? "true" : null}
          dangerouslySetInnerHTML={{ __html: this.props.html }}
        />
        {this.state.overflow ? (
          <Actions>
            <Toggle
              iconOff="chevronDown"
              iconOn="chevronUp"
              labelOn="Show less"
              labelOff="Show more"
              hideLabel
              onToggle={this.toggleShowAll}
              size="fill"
              type="flat"
              align="center"
            />
          </Actions>
        ) : null}
      </Wrapper>
    );
  }
}
