import React, { useState } from "react";
import styled from "styled-components";
import useIntersect from "../utils/use-intersect";
import { connect } from "react-redux";
import { toggleLightboxIsOpen } from "../store/actions";
import { Body } from "../components/body";
import Button from "./button";
import { Lightbox } from "./lightbox";
import { Spinner } from "./spinner";

const previewMaxHeight = 360;

const Actions = styled.div`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
`;

const Preview = ({
  media,
  preview,
  inListing,
  navigateToPost,
  backgroundColor,
  is_self,
  html,
  ...props
}) => {
  const [LbFullImage, setLbFullImage] = useState(false);
  const toggleLbFullImage = () => setLbFullImage(!LbFullImage);

  const [showLightbox, setShowLightbox] = useState(false);
  const toggleLightbox = () => {
    setShowLightbox(!showLightbox);
    setShowActions(false)
  }

  const [showActions, setShowActions] = useState(false);
  const enableActions = () => setShowActions(true);
  const disableActions = () => setShowActions(false);

  const [storedDisplayPreview, setStoredDisplayPreview] = useState(undefined);

  const [ref, entry] = useIntersect({
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });
  const visible = entry.isIntersecting;
  // const obstructed = !(entry.intersectionRatio > 0.9);

  let displayPreview = storedDisplayPreview;

  if (displayPreview === undefined) {
    displayPreview =
      is_self && html
        ? {
            component: Body,
            props: {
              html,
              inListing,
              width: null,
              height: null,
            },
          }
        : media && media.reddit_video
        ? {
            component: Video,
            props: {
              video: media.reddit_video,
              height: media.reddit_video.height,
              width: media.reddit_video.width,
            },
          }
        : preview && preview.reddit_video_preview
        ? {
            component: Video,
            props: {
              video: preview.reddit_video_preview,
              height: preview.reddit_video_preview.height,
              width: preview.reddit_video_preview.width,
            },
          }
        : media && media.oembed && media.type === "youtube.com"
        ? {
            component: Embed,
            props: {
              dangerouslySetInnerHTML: { __html: media.oembed.html },
              height: media.oembed.height,
              width: media.oembed.width,
            },
          }
        : preview && preview.images[0]
        ? preview.images[0].variants.mp4
          ? {
              component: Gif,
              props: {
                video: preview.images[0].variants.mp4.source,
                height: preview.images[0].variants.mp4.source.height,
                width: preview.images[0].variants.mp4.source.width,
              },
            }
          : preview.images[0].variants.gif
          ? {
              component: Image,
              props: {
                inListing,
                navigateToPost,
                alt: "",
                height: preview.images[0].variants.gif.source.height,
                width: preview.images[0].variants.gif.source.width,
              },
              image: preview.images[0].variants.gif,
            }
          : {
              component: Image,
              image: preview.images[0],
              props: {
                inListing,
                navigateToPost,
                height: preview.images[0],
                width: preview.images[0],
              },
            }
        : media && media.oembed
        ? {
            component: Embed,
            props: {
              dangerouslySetInnerHTML: { __html: media.oembed.html },
              height: media.oembed.height,
              width: media.oembed.width,
            },
          }
        : null;
  }
  if (!displayPreview) return null;
  if (displayPreview && displayPreview.image && !displayPreview.props.src) {
    // Reddit returns down-sampled resolutions of width:
    // 0: 108, 1: 216, 2: 320, 3: 640, 4: 960, 5: 1080
    const selectedImage =
      !inListing || displayPreview.image.source.height <= previewMaxHeight
        ? displayPreview.image.source
        : displayPreview.image.resolutions[3]
        ? displayPreview.image.resolutions[3]
        : displayPreview.image.resolutions[2]
        ? displayPreview.image.resolutions[2]
        : displayPreview.image.resolutions[1]
        ? displayPreview.image.resolutions[1]
        : displayPreview.image.resolutions[0]
        ? displayPreview.image.resolutions[0]
        : null;
    displayPreview = {
      ...displayPreview,
      props: {
        ...displayPreview.props,
        src: selectedImage.url,
        width: selectedImage.width,
        height: selectedImage.height,
      },
    };
  }
  if (displayPreview !== storedDisplayPreview)
    setStoredDisplayPreview(displayPreview);
  const Component = displayPreview.component;
  
  const showMedia = visible || displayPreview.component === Body || displayPreview.component === Embed;
  
  return (
    <PreviewWrapper
      backgroundColor={backgroundColor}
      onMouseEnter={enableActions}
      onMouseLeave={disableActions}
      ref={ref}
    >
      {showMedia ? (
        <Component {...displayPreview.props} />
      ) : (
        <Placeholder
          width={displayPreview.props.width}
          height={displayPreview.props.height}
        >
          <Spinner />
        </Placeholder>
      )}
      {showActions ? (
        <Actions>
          <Button
            hideLabel
            type="primary"
            label="View image in lighbtox"
            icon="maximize"
            onClick={toggleLightbox}
          />
        </Actions>
      ) : null}
      {showLightbox ? (
        <Lightbox
          close={toggleLightbox}
          image={preview.images[0].source}
          fullImage={LbFullImage}
          toggleFullImage={toggleLbFullImage}
        />
      ) : null}
    </PreviewWrapper>
  );
};

export default connect(
  null,
  { toggleLightboxIsOpen }
)(Preview);

const PreviewWrapper = styled.div`
  grid-area: media;
  position: relative;
  overflow: hidden;
  max-width: 100%;
  background: ${props => props.theme.container.levels[1]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Placeholder = styled.div.attrs(props => ({
  style: {
    width: props.width,
    height: props.height,
  },
}))`
  max-height: ${previewMaxHeight}px;
  max-width: 100%;
`;

const Image = styled.img`
  max-height: ${previewMaxHeight}px;
  width: auto;
`;

const Embed = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  max-height: ${previewMaxHeight}px;
  iframe {
    width: inherit;
    height: inherit;
  }
`;

const Video = ({ video }) => (
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
);

// Gif converted to video (post.preview.images[0].variants.mp4)
// Does not come with is_gif and uses different src names
const Gif = ({ video }) => (
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
);

const StyledVideo = styled.video`
  max-height: ${previewMaxHeight}px;
  max-width: inherit;
  margin: 0 auto;
`;
