import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import { toggleLightboxIsOpen } from "../store/actions";
import Button from "./button";
import Body from "./body";
import RedditVideo, { Gif } from "./reddit-video";
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
  title,
}) => {
  const [Preview, setPreview] = useState(undefined);

  const [showObscured, setShowObscured] = useState(!nsfw && !spoiler);
  const toggleObscured = () => {
    setShowObscured(!showObscured);
  };

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
        : media && media.reddit_video
        ? media.reddit_video.is_gif
          ? {
              Component: Gif,
              props: {
                video: media.reddit_video,
                height: media.reddit_video.height,
                width: media.reddit_video.width,
              },
            }
          : {
              Component: RedditVideo,
              props: {
                video: media.reddit_video,
                height: media.reddit_video.height,
                width: media.reddit_video.width,
              },
            }
        : preview && preview.reddit_video_preview
        ? preview.reddit_video_preview.is_gif
          ? {
              Component: Gif,
              props: {
                video: preview.reddit_video_preview,
                height: preview.reddit_video_preview.height,
                width: preview.reddit_video_preview.width,
              },
            }
          : {
              Component: RedditVideo,
              props: {
                video: preview.reddit_video_preview,
                height: preview.reddit_video_preview.height,
                width: preview.reddit_video_preview.width,
              },
            }
        : media && media.oembed && media.type !== "imgur.com"
        ? media.type === "twitter.com"
          ? {
              Component: Tweet,
              props: {
                id: media.oembed.url.match(
                  /https:\/\/twitter.com\/(?:.*)\/status\/([^/]*)/
                )[1],
                width: media.oembed.width,
              },
            }
          : {
              Component: Embed,
              props: {
                dangerouslySetInnerHTML: { __html: media.oembed.html },
                height: previewMaxHeight,
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
    if (preview && Preview && Preview.props.video) {
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
      Preview.props.title = title;
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
    title,
  ]);

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
    <>
      <PreviewWrapper
        className="preview-wrapper"
        backgroundColor={backgroundColor}
        restrictHeight={
          Preview.Component === Image ||
          Preview.Component === RedditVideo ||
          Preview.Component === Gif
        }
        // ref={ref}
      >
        {/* <Placeholder
          className="placeholder"
          grow={Preview.Component === RedditVideo ? "true" : null}
          ratio={ratio}
          height={
            Preview.props.height > previewMaxHeight
              ? previewMaxHeight
              : Preview.props.height
          }
          width={Preview.props.width}
        /> */}
        {inListing && !showObscured ? (
          <ObscurePlaceholder nsfw={nsfw}>
            <Button
              label={obscureLabel}
              icon="eye"
              onClick={toggleObscured}
              primary
            />
          </ObscurePlaceholder>
        ) : null}
        <Preview.Component
          className="preview-component"
          {...Preview.props}
          blur={!showObscured}
        />
      </PreviewWrapper>
    </>
  );
};

export default connect(
  null,
  { toggleLightboxIsOpen }
)(Preview);
export const blur = css`
  filter: ${({ blur }) => (blur ? "blur(30px)  grayscale(30%)" : null)};
`;

const PreviewWrapper = styled.div`
  grid-area: media;
  position: relative;
  max-width: 100%;
  background: ${({ theme }) => theme.card.bg};
  overflow: hidden;
  max-height: ${({ restrictHeight }) =>
    restrictHeight ? previewMaxHeight + "px" : null};
`;

const ObscurePlaceholder = styled.div`
  width: 100%;
  height: 100%;
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

const Image = (props) => (
  <ImageWrapper>
    <StyledImage {...props} />
  </ImageWrapper>
);

const ImageWrapper = styled.div`
  max-width: 100%;
  max-height: ${previewMaxHeight}px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const StyledImage = styled.img`
  max-height: ${previewMaxHeight}px;
  max-width: 100%;
  height: auto;
  width: auto;
  margin: 0 auto;
  ${blur}
  overflow: hidden;
`;

const Embed = styled.div`
  height: 100%;
  width: 100%;
  max-height: ${previewMaxHeight}px;
  position: absolute;
  top: 0;
  iframe {
    width: inherit;
    height: inherit;
  }
`;
