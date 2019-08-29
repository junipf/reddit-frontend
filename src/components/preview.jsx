import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useIntersect from "../utils/use-intersect";
import { connect } from "react-redux";
import { toggleLightboxIsOpen } from "../store/actions";
import Button from "./button";
import { Body } from "./body";
import Video, { Gif, GifVideo } from "./reddit-video";
import Tweet from "./tweet";

const previewMaxHeight = 512;

const Preview = ({
  media,
  mediaEmbed,
  preview,
  inListing,
  navigateToPost,
  backgroundColor,
  nsfw,
  spoiler,
  isSelf,
  html,
}) => {
  const [Preview, setPreview] = useState(undefined);

  const [showObscured, setShowObscured] = useState(!nsfw && !spoiler);
  const toggleObscured = () => {
    setShowObscured(!showObscured);
  };

  const [ref, entry] = useIntersect({
    rootMargin: "500px 500px 500px 500px",
    threshold: 0.1,
  });

  const visible = entry.isIntersecting;

  useEffect(() => {
    let Preview =
      isSelf && html
        ? {
            Component: Body,
            props: {
              html: html,
              width: null,
              height: null,
              inListing,
            },
          }
        : media && media.reddit_video && media.reddit_video.is_gif
        ? {
            Component: GifVideo,
            props: {
              video: media.reddit_video,
              height: media.reddit_video.height,
              width: media.reddit_video.width,
            },
          }
        : media && media.reddit_video
        ? {
            Component: Video,
            props: {
              video: media.reddit_video,
              height: media.reddit_video.height,
              width: media.reddit_video.width,
            },
          }
        : preview && preview.reddit_video_preview
        ? {
            Component: Video,
            props: {
              video: preview.reddit_video_preview,
              height: preview.reddit_video_preview.height,
              width: preview.reddit_video_preview.width,
            },
          }
        : media &&
          media.oembed &&
          (media.type === "youtube.com" || media.type === "m.youtube.com")
        ? {
            Component: Embed,
            props: {
              dangerouslySetInnerHTML: { __html: media.oembed.html },
              height: previewMaxHeight,
              width: media.oembed.width,
            },
          }
        : media && media.oembed && media.type === "twitter.com"
        ? {
            Component: Tweet,
            props: {
              id: media.oembed.url.match(
                /https:\/\/twitter.com\/(?:.*)\/status\/([^/]*)/
              )[1],
              width: media.oembed.width,
            },
          }
        : preview && preview.images[0]
        ? preview.images[0].variants.mp4
          ? {
              Component: Gif,
              props: {
                video: preview.images[0].variants.mp4.source,
                height: preview.images[0].variants.mp4.source.height,
                width: preview.images[0].variants.mp4.source.width,
              },
            }
          : preview.images[0].variants.gif
          ? {
              Component: Image,
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
              Component: Image,
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
            Component: Embed,
            props: {
              dangerouslySetInnerHTML: { __html: media.oembed.html },
              height: media.oembed.height,
              width: media.oembed.width,
            },
          }
        : null;
    if (Preview && Preview.image && !Preview.props.src) {
      // Reddit returns down-sampled resolutions of width:
      // 0: 108, 1: 216, 2: 320, 3: 640, 4: 960, 5: 1080
      const selectedImage =
        !inListing || Preview.image.source.height <= previewMaxHeight
          ? Preview.image.source
          : Preview.image.resolutions[Preview.image.resolutions.length - 1];

      Preview = {
        ...Preview,
        props: {
          ...Preview.props,
          src: selectedImage.url,
          width: selectedImage.width,
          height: selectedImage.height,
        },
      };
    }
    if (Preview && Preview.props.video) {
      // We pull the preview image for use as a poster for videos
      Preview.props.poster =
        preview.images[0].source.height <= previewMaxHeight
          ? preview.images[0].source.url
          : preview.images[0].resolutions[
              preview.images[0].resolutions.length - 1
            ].url;
    }
    if (Preview) {
      Preview.props.blur = nsfw && inListing && !showObscured;
    }
    setPreview(Preview);
  }, [
    navigateToPost,
    media,
    mediaEmbed,
    preview,
    inListing,
    backgroundColor,
    nsfw,
    setPreview,
    html,
    isSelf,
    showObscured,
  ]);

  // const showMedia = Preview ? visible : false;
  // const [ratio, setRatio] = useState(
  //   Preview ? (Preview.props.height / Preview.props.width) * 100 : null
  // );
  // const [placeholderHeight, setPlaceholderHeight] = useState(
  // Preview ? Preview.props.height : previewMaxHeight
  // );
  // const updatePlaceholder = ({ height, width }) => {
  // console.log(`Ratio updated from ${ratio} to ${(height / width) * 100}`);
  // setRatio((height / width) * 100);
  // setPlaceholderHeight(height);
  // };

  const ratio = Preview
    ? (Preview.props.height / Preview.props.width) * 100
    : null;
  const placeholderHeight = Preview ? Preview.props.height : previewMaxHeight;

  const obscureLabel =
    nsfw && spoiler
      ? "NSFW and Spoiler"
      : nsfw
      ? "NSFW"
      : spoiler
      ? "Spoiler"
      : null;

  if (!Preview) return null;
  return (
    <PreviewWrapper
      backgroundColor={backgroundColor}
      height={Preview.props.height}
      ref={ref}
    >
      <Placeholder ratio={ratio} height={placeholderHeight} />
      {inListing && !showObscured ? (
        <ObscurePlaceholder nsfw={nsfw}>
          <Button label={obscureLabel} icon="eye" onClick={toggleObscured} />
        </ObscurePlaceholder>
      ) : null}
      {Preview.Component === Body || Preview.Component === Tweet ? (
        <Preview.Component {...Preview.props} visible={visible} />
      ) : (
        <>
          <MediaWrapper ratio={ratio}>
            <Preview.Component {...Preview.props} visible={visible} />
          </MediaWrapper>
        </>
      )}
    </PreviewWrapper>
  );
};

export default connect(
  null,
  { toggleLightboxIsOpen }
)(Preview);

const MediaWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: ${({ ratio }) => (ratio ? "absolute" : null)};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const PreviewWrapper = styled.div.attrs(({ height }) => ({
  style: {
    maxHeight: height < previewMaxHeight ? height : previewMaxHeight,
  },
}))`
  grid-area: media;
  position: relative;
  max-width: 100%;
  background: ${({ theme }) => theme.card.bg};
  overflow: hidden;
`;

const Placeholder = styled.div.attrs(({ ratio, height }) => ({
  style: {
    paddingBottom: ratio + "%",
    maxHeight: height,
  },
}))`
  max-width: inherit;
`;

const ObscurePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ nsfw }) =>
    nsfw ? "hsla(0, 100%, 30%, 0.5)" : "hsla(0, 0%, 30%, 0.5)"};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
`;

const Image = props => (
  <ImageWrapper>
    <StyledImage {...props} />
  </ImageWrapper>
);

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  max-width: 100%;
  max-height: ${previewMaxHeight}px;
`;

const StyledImage = styled.img`
  max-height: ${previewMaxHeight}px;
  max-width: 100%;
  height: auto;
  width: auto;
  margin: 0 auto;
  filter: ${({ blur }) => (blur ? "blur(50px)" : null)};
  overflow: hidden;
`;

const Embed = styled.div`
  /* height: ${({ height }) => height}px; */
  /* width: ${({ width }) => width}px; */
  height: 100%;
  width: 100%;
  max-height: ${previewMaxHeight}px;
  position: absolute;
  top: 0;
  iframe {
    width: inherit;
    height: inherit;
  }
  filter: ${({ blur }) => (blur ? "blur(20px)" : null)};
`;
