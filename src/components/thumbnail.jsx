import React from "react";
import styled from "styled-components";
import LazyLoad from "react-lazy-load";

const Thumbnail = props => {
  const { preview: { images } = {}, width, height } = props;
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
    <Thumb width={width} height={height}>
      <LazyLoad debounce={false} offset={1000} width={width} height={height}>
        <img width={width} height={height} src={thumb.url} alt="thumbnail" />
      </LazyLoad>
    </Thumb>
  );
};

const Thumb = styled.div`
  border: 1px solid ${props => props.theme.container.innerBorder};
  border-radius: 0.25rem;
  overflow: hidden;
  margin: 0.5rem;
  grid-row: 1 / -1;
  grid-column: 3;
  grid-area: ${props => props.postIsCompact ? "media" : null};
  background: ${props => props.theme.container.levels[2]};
  width: ${props => props.width + "px"};
  height: ${props => props.height + "px"};
`;

export default Thumbnail;
