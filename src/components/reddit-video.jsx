import React, { useState, useRef } from "react";
import styled from "styled-components";
import Button from "./button";
import Dropdown from "./dropdown";
import Icon from "./icon";
import Error from "./error";
import formatMs from "../utils/format-ms";

export const Video = ({
  video: {
    is_gif: isGif,
    duration,
    width,
    height,
    url,
    dash_url: dashUrl,
    fallback_url: fallbackUrl,
    hls_url: hlsUrl,
    scrubber_media_url: scrubberUrl,
    transcoding_status: status,
  },
  blur,
  poster,
}) => {
  // Reddit splits the audio track into a separate file to force people
  // to share direct reddit links in order to share reddit videos.
  const $video = useRef(null);
  const $audio = useRef(null);
  const $wrapper = useRef(null);

  // Audio link is not returned by API, but can be created from fallback_url.
  const audioUrl = fallbackUrl
    ? fallbackUrl.replace(
        fallbackUrl.split("/")[fallbackUrl.split("/").length - 1],
        "audio"
      )
    : null;

  const [controls, setControls] = useState({
    paused: true,
    ended: false,
    loop: false,
    playbackRate: 1,
    volume: 1,
    muted: false,
    currentTime: 0,
  });

  const setControlsState = (state) => setControls((c) => ({ ...c, ...state }));

  const setMediaState = (state, media = [$audio.current, $video.current]) => {
    media.forEach((media) => {
      if (!media) return;
      Object.entries(state).forEach(([key, value]) => {
        if (media[key] !== value) {
          console.log(
            `setting ${key} from ${media[key]} to ${value} on ${media.tagName}`
          );
          media[key] = value;
          setControlsState({ [key]: value });
        }
      });
    });
  };

  const updateCurrentTime = ({ target: { currentTime } }) =>
    setControlsState({ currentTime });

  const [seeking, setSeeking] = useState(false);

  const beginSeek = () => {
    setSeeking(true);
    $video.current.pause();
    $audio.current.pause();
  };

  const handleSeekDrag = (e) => {
    console.log(e);
    if (seeking) seek(e);
  };

  const handleSeek = (e) => {
    seek(e);
    if (seeking) {
      $video.current.play();
      $audio.current.play();
      setSeeking(false);
    }
  };
  
  const endSeek = () => {
    setSeeking(false);
  }

  const seek = ({ target, nativeEvent: { clientX } }) => {
    const { x, width } = target.getBoundingClientRect();
    setMediaState({
      currentTime: Math.round(((clientX - x) / width) * duration * 10) / 10,
    });
  };

  const togglePause = () => {
    if ($video.current.paused) {
      $video.current.play();
      $audio.current.play();
    } else {
      $video.current.pause();
      $audio.current.pause();
    }
  };

  const syncStates = ({
    target,
    target: {
      paused,
      ended,
      loop,
      playbackRate,
      volume,
      muted,
      currentTime,
    } = {},
  }) => {
    const syncMedia =
      target === $video.current && $audio && $audio.current
        ? $audio.current
        : target === $audio.current && $video && $video.current
        ? $video.current
        : null;

    if (syncMedia) {
      setMediaState(
        {
          loop,
          playbackRate,
          volume,
          muted,
        },
        [syncMedia]
      );
      if (syncMedia.paused !== paused) {
        if (paused) syncMedia.pause();
        else syncMedia.play();
      }
    }

    setControlsState({
      ...controls,
      paused,
      ended,
      loop,
      playbackRate,
      volume,
      muted,
      currentTime,
    });
  };

  // Controls or external -> Video state -> Sync to Controls, sync to Audio

  // Handle errors
  const [error, setError] = useState(null);
  const updateError = (e) => {
    if (e && e.message) setError({ e, type: "video", name: "video" });
  };

  const toggleFullscreen = () => {
    if (document.fullscreen) {
      document.exitFullscreen();
    } else {
      $wrapper.current.requestFullscreen();
    }
  };

  const fullscreen = document.fullscreen;

  const autoPlay = blur ? null : isGif;

  const showBigPlayButton = controls.currentTime === 0 && controls.paused;

  const showReplayButton = controls.ended;

  const debugVideoToConsole = () =>
    console.log(
      `${width}x${height} ${duration}s ${isGif ? "gif" : "video"}
Transcoding ${status}
    URLs:
    dash: ${dashUrl}
fallback: ${fallbackUrl}
     hls: ${hlsUrl}
scrubber: ${scrubberUrl}
   audio: ${audioUrl}`
    );

  return (
    <Wrapper ref={$wrapper}>
      <StyledVideo
        ref={$video}
        poster={poster}
        blur={blur}
        autoPlay={autoPlay}
        muted={autoPlay}
        preload={blur ? null : "auto"}
        loop={isGif}
        height={height}
        width={width}
        onClick={togglePause}
        onError={updateError}
        onLoadedMetadata={syncStates}
        onPlay={syncStates}
        onPause={syncStates}
        onEnded={syncStates}
        onVolumeChange={syncStates}
        onRateChange={syncStates}
        onTimeUpdate={updateCurrentTime}
        onCanPlay={syncStates}
        onAbort={(e) => console.log(e)}
      >
        <source src={url} />
        <source src={hlsUrl} type="application/vnd.apple.mpegURL" />
        <source src={dashUrl} />
        <source src={fallbackUrl} />
        Video failed to load
      </StyledVideo>
      <Audio
        ref={$audio}
        autoPlay={autoPlay}
        muted={autoPlay}
        onError={updateError}
        onPlay={syncStates}
        onPause={syncStates}
        onEnded={syncStates}
        onVolumeChange={syncStates}
        onRateChange={syncStates}
        onTimeUpdate={updateCurrentTime}
        onCanPlay={syncStates}
      >
        <source src={audioUrl} />
      </Audio>
      <Controls>
        <Section>
          <Button onClick={togglePause}>
            <Icon icon={controls.paused ? "play" : "pause"} />
          </Button>
          <Button onClick={setMediaState} value={{ muted: !controls.muted }}>
            <Icon
              icon={
                controls.muted
                  ? "volumeX"
                  : controls.volume >= 0.66
                  ? "volume2"
                  : controls.volume >= 0.33
                  ? "volume1"
                  : "volume0"
              }
            />
          </Button>
          <Time>{formatMs(Math.round(controls.currentTime))}</Time>
        </Section>
        <Seekbar
          progress={(controls.currentTime / duration) * 100 + "%"}
          handleSeek={handleSeek}
          handleSeekDrag={handleSeekDrag}
          beginSeek={beginSeek}
          endSeek={endSeek}
        />
        <Section>
          <Time>{formatMs(Math.round(duration))}</Time>
          <Button
            onClick={setMediaState}
            value={{ loop: !controls.loop }}
            type={controls.loop ? "primary" : "secondary"}
          >
            <Icon icon="repeat" />
          </Button>
          <Dropdown
            label={`${controls.playbackRate}x`}
            onSelect={setMediaState}
            up
            left
          >
            <Button value={{ playbackRate: 0.5 }} label="Slow (0.5x)" />
            <Button value={{ playbackRate: 1 }} label="Normal (1.0x)" />
            <Button value={{ playbackRate: 1.25 }} label="Fast (1.25x)" />
            <Button value={{ playbackRate: 1.5 }} label="Faster (1.5x)" />
            <Button value={{ playbackRate: 2 }} label="Ludicrous (2.0x)" />
          </Dropdown>
          {process.env.NODE_ENV === "development" ? (
            <Dropdown hideLabel up left>
              Debug menu
              <Button onClick={debugVideoToConsole}>
                Log video to console
              </Button>
              <Button onClick={setMediaState} value={{ currentTime: 0 }}>
                <Icon icon="skipBack" />
                Skip to beginning
              </Button>
              <Button onClick={setMediaState} value={{ currentTime: duration }}>
                <Icon icon="skipForward" />
                Skip to end
              </Button>
            </Dropdown>
          ) : null}
          {document.fullscreenEnabled ? (
            <Button onClick={toggleFullscreen}>
              <Icon icon={fullscreen ? "maximize" : "minimize"} />
            </Button>
          ) : null}
        </Section>
      </Controls>
      {error ? (
        <Overlay>
          <Error {...error} />
        </Overlay>
      ) : showReplayButton ? (
        <Overlay>
          <Button size="large" type="flat">
            <Icon icon="rotateCCW" />
          </Button>
        </Overlay>
      ) : showBigPlayButton ? (
        <Overlay>
          <Button size="large" type="flat">
            <Icon icon="play" />
          </Button>
        </Overlay>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: inherit;
  height: 100%;
  width: 100%;
  margin: 0;
  display: block;
`;

const Seekbar = ({
  progress,
  audioBuffered,
  videoBuffered,
  handleSeek,
  handleSeekDrag,
  beginSeek,
  endSeek,
}) => (
  <StyledSeekbar
    onMouseDown={beginSeek}
    onMouseMove={handleSeekDrag}
    onMouseUp={handleSeek}
    onMouseLeave={endSeek}
  >
    <Bar>
      <ProgressBar progress={progress} />
      {/* <BufferBar progress={videoBuffered} /> */}
      {/* <BufferBar progress={audioBuffered} /> */}
    </Bar>
  </StyledSeekbar>
);

const StyledSeekbar = styled.div`
  width: auto;
  height: 1rem;
  margin: auto 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border: none;
  left: 0;
  right: 0;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.card.innerBorder};
  position: relative;
`;

const Bar = styled.div`
  width: auto;
  height: 0.25rem;
  margin: auto 0;
  border: none;
  border-radius: 0.25rem;
  left: 0;
  right: 0;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.card.border};
  position: relative;
  pointer-events: none;
`;

const ProgressBar = styled.div.attrs(({ progress }) => ({
  style: { width: progress },
}))`
  height: 0.25rem;
  background-color: ${({ theme }) => theme.highlight};
  border-radius: 1rem;
  box-shadow: 0 0 5px 0 ${({ theme }) => theme.focus.glow};
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
`;

// const BufferBar = styled(ProgressBar)`
//   background-color: rgba(0, 0, 0, 0.25);
//   box-shadow: none;
// `;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  background-color: rgba(0, 0, 0, 0.45);
  color: white;
  padding: 0.25rem;
  display: flex;
  flex-flow: row nowrap;
`;

const Section = styled.div`
  flex: 0 0 auto;
  margin: 0 0.5rem;
`;

const Time = styled.span`
  margin: 0 0.5rem;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
`;

// Gif converted to video (post.preview.images[0].variants.mp4)
// Does not come with is_gif and uses different src names
export const Gif = ({ video }) => (
  <Wrapper>
    <StyledVideo
      autoPlay={true}
      muted
      controls={false}
      preload="auto"
      loop={true}
      height={video.height}
      width={video.width}
    >
      <source src={video.url} />
      Gif failed to load
    </StyledVideo>
  </Wrapper>
);

export const GifVideo = ({
  video: {
    url,
    dash_url: dashUrl,
    fallback_url: fallbackUrl,
    hls_url: hlsUrl,
    width,
    height,
  },
}) => {
  const handleClick = (e) =>
    e.target.paused ? e.target.play() : e.target.pause();
  return (
    <Wrapper>
      <StyledVideo
        autoPlay={true}
        muted
        controls={false}
        preload="auto"
        loop={true}
        height={height}
        width={width}
        onClick={handleClick}
      >
        <source src={url} />
        <source src={hlsUrl} type="application/vnd.apple.mpegURL" />
        <source src={dashUrl} />
        <source src={fallbackUrl} />
        Gif failed to load
      </StyledVideo>
    </Wrapper>
  );
};

const StyledVideo = styled.video`
  max-width: inherit;
  height: 100%;
  width: 100%;
  /* width: auto; */
  margin: 0 auto;
  background-color: black;
  filter: ${({ blur }) => (blur ? "blur(20px)" : null)};
`;

const Audio = styled.audio`
  /* display: none; */
  width: 100%;
  position: absolute;
  bottom: 40px;
`;
