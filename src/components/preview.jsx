import React from "react";
import styled from "styled-components";
import LazyLoad from "react-lazy-load";
import { connect } from "react-redux";
import { toggleLightboxIsOpen } from "../store/actions";

import Button from "./button";
import { Lightbox } from "./lightbox";

const previewMaxHeight = 360;

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
    this.state = {
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
  render() {
    const {
      media,
      preview,
      inListing,
      navigateToPost,
      // id,
      backgroundColor,
    } = this.props;
    const { showLightbox, LbFullImage } = this.state;

    const displayPreview =
      media && media.reddit_video ? (
        <Video video={media.reddit_video} />
      ) : preview && preview.reddit_video_preview ? (
        <Video video={preview.reddit_video_preview} />
      ) : media && media.oembed ? (
        <Embed oembed={media.oembed} />
      ) : preview && preview.images[0] ? (
        preview.images[0].variants.mp4 ? (
          <Gif video={preview.images[0].variants.mp4.source} />
        ) : preview.images[0].variants.gif ? (
          <Image
            image={preview.images[0].variants.gif}
            inListing={inListing}
            navigateToPost={navigateToPost}
            toggleLightbox={this.toggleLightbox}
          />
        ) : (
          <Image
            image={preview.images[0]}
            inListing={inListing}
            navigateToPost={navigateToPost}
            toggleLightbox={this.toggleLightbox}
          />
        )
      ) : null;
    if (displayPreview === null) {
      return null;
    } else {
      return (
        <PreviewWrapper backgroundColor={backgroundColor}>
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
  grid-area: media;
  max-height: ${previewMaxHeight}px;
  min-height: 100px;
  position: relative;
  overflow: hidden;
  max-width: 100%;
  .LazyLoad {
    max-width: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.container.levels[2]};
  }
`;

const Image = props => {
  const { inListing, image, toggleLightbox } = props;
  // Reddit returns down-sampled resolutions of width:
  // 0: 108, 1: 216, 2: 320, 3: 640, 4: 960, 5: 1080
  const selectedImage =
    !inListing || image.source.height <= previewMaxHeight
      ? image.source.height
      : image.resolutions[3]
      ? image.resolutions[3]
      : image.resolutions[2]
      ? image.resolutions[2]
      : image.resolutions[1]
      ? image.resolutions[1]
      : image.resolutions[0]
      ? image.resolutions[0]
      : null;

  return (
    <LazyLoad
      debounce={false}
      offset={1000}
      height={
        selectedImage.height > previewMaxHeight
          ? previewMaxHeight
          : selectedImage.height
      }
    >
      <>
        <ResizedImage alt="" src={selectedImage.url} />
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
    </LazyLoad>
  );
};

const ResizedImage = styled.img`
  max-height: ${previewMaxHeight}px;
  width: auto;
`;

const Embed = ({ oembed }) => (
  <LazyLoad
    debounce={false}
    offset={1000}
    height={oembed.height > previewMaxHeight ? previewMaxHeight : oembed.height}
  >
    <StyledEmbed
      width={oembed.width}
      height={oembed.height}
      dangerouslySetInnerHTML={{ __html: oembed.html }}
    />
  </LazyLoad>
);

const StyledEmbed = styled.div`
  height: ${props => props.height}px;
  width: inherit;
  max-height: ${previewMaxHeight}px;
  iframe {
    width: inherit;
    height: inherit;
  }
`;

const Video = ({ video }) => (
  <LazyLoad
    debounce={false}
    offset={1000}
    height={video.height > previewMaxHeight ? previewMaxHeight : video.height}
  >
    <StyledVideo
      autoPlay={video.is_gif}
      controls={!video.is_gif}
      preload="auto"
      loop={video.is_gif}
      height={video.height}
      width={video.width}
    >
      <source src={video.url} />
      <source src={video.hls_url} type="application/vnd.apple.mpegURL" />
      <source src={video.dash_url} />
      <source src={video.fallback_url} />
      Video failed to load
    </StyledVideo>
  </LazyLoad>
);

// Gif converted to video, found in post.preview.images[0].variants.mp4
// Does not come with is_gif and uses different src names
const Gif = ({ video }) => (
  <LazyLoad
    debounce={false}
    offset={1000}
    height={video.height > previewMaxHeight ? previewMaxHeight : video.height}
  >
    <StyledVideo
      autoPlay={true}
      controls={false}
      preload="auto"
      loop={true}
      height={video.height}
      width={video.width}
    >
      <source src={video.url} />
      Gif failed to load
    </StyledVideo>
  </LazyLoad>
);

const StyledVideo = styled.video`
  max-height: ${previewMaxHeight}px;
  max-width: inherit;
  margin: 0 auto;
`;
