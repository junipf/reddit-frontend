import React from "react";
import styled from "styled-components";

import { connect } from "react-redux";
import { toggleLightboxIsOpen } from "../store/actions";

// import Observer from "@researchgate/react-intersection-observer";

import Button from "./button";
// import Toggle from "./toggle";
import { colors } from "../style/color-theme";
import { Lightbox } from "./lightbox";

const Actions = styled.div`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
`;

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLightbox = this.toggleLightbox.bind(this);
    this.toggleLbFullImage = this.toggleLbFullImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
    this.state = {
      visible: true,
      LbFullImage: false,
      showLightbox: false,
    };
  }
  toggleLightbox = () => {
    this.setState({
      showLightbox: !this.state.showLightbox,
    });
    this.props.toggleLightboxIsOpen();
  };
  toggleLbFullImage = () => {
    this.setState({
      LbFullImage: !this.state.LbFullImage,
    });
  };
  handleChange(e) {
    // console.log(e);
    const intersect = e.isIntersecting ? true : false;
    if (intersect) {
      this.setState({ visible: intersect });
    }
    // if (e.isIntersecting) {
    //   this.setState({ visible: true });
    // } else {
    //   this.setState({ visible: false });
    // }
    // if (!e.isIntersecting)
    //   this.setState({
    //     visible: false,
    //   });
  }
  toggleVisible() {
    this.setState({ visible: !this.state.visible });
  }
  render() {
    const {
      media,
      preview,
      isCrosspost,
      inListing,
      navigateToPost,
      // id,
      backgroundColor,
    } = this.props;
    const { visible, showLightbox, LbFullImage } = this.state;
    const displayPreview = isCrosspost ? null : media &&
      media.type === "youtube.com" ? (
      <Embed visible={visible} oembed={media.oembed} />
    ) : media && media.reddit_video ? (
      <Video visible={visible} video={media.reddit_video} />
    ) : preview && preview.reddit_video_preview ? (
      <Video visible={visible} video={preview.reddit_video_preview} />
    ) : preview ? (
      <Image
        visible={visible}
        // Reddit returns an array of down-sampled resolutions,
        // if the image is larger than the size. Order (width):
        // 0: 108, 1: 216, 2: 320, 3: 640, 4: 960, 5: 1080
        preview={
          !inListing || preview.images[0].source.width < 700
            ? preview.images[0].source
            : preview.images[0].resolutions[3] ||
              preview.images[0].resolutions[2] ||
              preview.images[0].resolutions[1] ||
              preview.images[0].resolutions[0]
        }
        inListing={inListing}
        navigateToPost={navigateToPost}
        toggleLightbox={this.toggleLightbox}
      />
    ) : null;
    if (displayPreview === null) {
      return null;
    } else {
      return (
        <PreviewWrapper backgroundColor={backgroundColor}>
          {/* <Observer onChange={this.handleChange} root="main-column">
            <Observable></Observable>
          </Observer> */}
          {displayPreview}
          {showLightbox ? (
            <Lightbox
              close={this.toggleLightbox}
              image={preview.images[0].source}
              fullImage={LbFullImage}
              toggleFullImage={this.toggleLbFullImage}
            />
          ) : null}
        </PreviewWrapper>
      );
    }
  }
}
export default connect(
  null,
  { toggleLightboxIsOpen }
)(Preview);

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 360px;
  min-height: 100px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.container.levels[2]};
`;

// Observer uses refs so requires a stateful component
// class Observable extends React.Component {
//   render() {
//     return this.props.children;
//   }
// }

// const Spacer = styled.div`
//   width: ${props => props.width};
//   height: ${props => props.height};
//   max-height: 250px;
//   max-width: 100%;
//   min-height: 200px;
//   min-width: 200px;
//   background-color: red;
// `;

//
// Image
//

const Image = ({
  visible = true,
  preview,
  inListing,
  navigateToPost,
  toggleLightbox,
}) =>
  visible ? (
    <>
      <ResizedImage
        src={preview.url}
        alt="post"
        onClick={inListing ? navigateToPost : toggleLightbox}
        width={preview.width}
        height={preview.height}
      />
      <Actions>
        <Button
          hideLabel
          type="primary"
          label="View image in lighbtox"
          icon="maximize"
          onClick={toggleLightbox}
        />
      </Actions>
    </>
  ) : (
    <ResizedImagePlaceholder
      alt="post"
      width={preview.width}
      height={preview.height}
    />
  );

const ResizedImage = styled.img`
  max-height: inherit;
  width: auto;
`;

const ResizedImagePlaceholder = styled(ResizedImage)`
  background-color: orange;
  width: 100%;
`;

//
// Embed
//

const Embed = ({ visible = true, oembed }) =>
  visible ? (
    <StyledEmbed
      width={oembed.width}
      height={oembed.height}
      dangerouslySetInnerHTML={{ __html: oembed.html }}
    />
  ) : (
    <EmbedPlaceholder width={oembed.width} height={oembed.height} />
  );

const StyledEmbed = styled.div`
  height: ${props => props.height}px;
  width: inherit;
  max-height: inherit;
  iframe {
    width: inherit;
    height: inherit;
  }
`;

const EmbedPlaceholder = styled(StyledEmbed)`
  background-color: green;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`;

//
// Video
//

const Video = ({ visible = true, video }) =>
  visible ? (
    <StyledVideo
      autoPlay={video.is_gif}
      controls={!video.is_gif}
      preload="auto"
      loop={video.is_gif}
      height={video.height}
      width={video.width}
    >
      <source src={video.hls_url} type="application/vnd.apple.mpegURL" />
      <source src={video.dash_url} />
      <source src={video.fallback_url} />
      Video failed to load
    </StyledVideo>
  ) : (
    <VideoPlaceholder height={video.height} width={video.width} />
  );

const StyledVideo = styled.video`
  /* height: auto; */
  max-height: inherit;
  max-width: inherit;
  margin: 0 auto;
`;

const VideoPlaceholder = styled(StyledVideo)`
  background-color: pink;
`;
