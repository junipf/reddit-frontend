import React from "react";
import styled from "styled-components";

const Thumbnail = ({ preview: { images } = {}, width, height, url }) => {
  // Reddit returns down-sampled resolutions of width:
  // 0: 108, 1: 216, 2: 320, 3: 640, 4: 960, 5: 1080
  const thumb =
    images[0].source.width <= 140 && images[0].source.height <= 100
      ? images[0].source
      : images[0].resolutions[2] ||
        images[0].resolutions[1] ||
        images[0].resolutions[0];

  if (thumb.height > 140) {
  }
  return (
    <Thumb width={width} height={height} as={url ? "a" : "div"} href={url}>
      <img width={width} height={height} src={thumb.url} alt="thumbnail" />
    </Thumb>
  );
};

const Thumb = styled.div`
  border: 1px solid ${({ theme }) => theme.card.innerBorder};
  border-radius: 0.25rem;
  overflow: hidden;
  margin: 0.5rem;
  grid-row: 1 / -1;
  grid-column: 3;
  grid-area: ${({ postIsCompact }) => (postIsCompact ? "media" : null)};
  background: ${({ theme }) => theme.card.innerBg};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  &[href]:hover {
    border-color: ${({theme}) => theme.focus.border};
    opacity: 0.9;
  }
`;

export default Thumbnail;
