import React from "react";
import styled from "styled-components";
import Button from "./button";

const Lb = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.85);
  cursor: default;
`;

const ImageWrapper = styled.div`
  max-height: ${props =>
    props.allowOverflow && props.overflow ? "unset" : "100vh"};
  max-width: ${props =>
    props.allowOverflow && props.overflow ? "unset" : "100vw"};
  max-height: 100vh;
  max-width: 100vw;
`;

const Image = styled.img`
  cursor: ${props =>
    props.overflow
      ? props.allowOverflow
        ? "zoom-out"
        : "zoom-in"
      : "default"};
  max-height: ${props =>
    props.allowOverflow && props.overflow ? "unset" : "100vh"};
  max-width: ${props =>
    props.allowOverflow && props.overflow ? "unset" : "100vw"};
  width: inherit;
  height: inherit;
  text-align: center;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const CloseButton = styled(Button)`
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 40;
`;

export class Lightbox extends React.Component {
  constructor(props) {
    super(props);
    const { image } = props;
    this.state = {
      overflow: this.isOverflowing(image),
      allowOverflow: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.node = React.createRef();
  }
  isOverflowing = image =>
    image.height > window.innerHeight || image.width > window.innerWidth;

  componentWillMount() {
    document.addEventListener("click", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }
  handleClick = e => {
    const { close, image } = this.props;
    if (this.node.current.contains(e.target)) {
      const isOverflowing = this.isOverflowing(image);
      this.setState({
        overflow: isOverflowing,
        allowOverflow: !this.state.allowOverflow,
      });
    } else close();
  };
  render() {
    const { image } = this.props;
    const { overflow, allowOverflow } = this.state;
    return (
      <Lb>
        <CloseButton icon="x" onDark />
        {/* <Shadow onClick={close} /> */}
        <ImageWrapper
          overflow={overflow}
          allowOverflow={allowOverflow}
          ref={this.node}
        >
          <Image
            src={image.url}
            alt="post"
            overflow={overflow}
            allowOverflow={allowOverflow}
          />
        </ImageWrapper>
      </Lb>
    );
  }
}
