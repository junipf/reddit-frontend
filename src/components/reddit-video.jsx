import React, { useState, useRef, useMemo, useEffect } from "react";
import styled from "styled-components";
import Button from "./button";
import Dropdown from "./dropdown";
import Icon from "./icon";
import Error from "./error";
import formatMs from "../utils/format-ms";
import DarkThemeProvider from "../style/dark-theme-provider";

const Video = ({
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
    visible,
  },
  blur,
  poster,
  theme,
}) => {
  // Reddit splits the audio track into a separate file to force people
  // to share direct reddit links in order to share reddit videos.
  const $video = useRef(null);
  const $audio = useRef(null);
  const $wrapper = useRef(null);
  const $progress = useRef(null);
  const $volume = useRef(null);

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

  const setMediaState = (state, media = [$video.current, $audio.current]) => {
    media.forEach((media) => {
      if (!media || isNaN(media.duration)) return;
      Object.entries(state).forEach(([key, value]) => {
        if (media[key] !== value) {
          media[key] = value;
          setControlsState({ [key]: value });
        }
      });
    });
  };

  const updateCurrentTime = ({ target: { currentTime } }) =>
    setControlsState({ currentTime });

  const [hasAudio, setHasAudio] = useState(!!audioUrl);

  const initialize = (e) => {
    if ($audio.current.networkState === 3) setHasAudio(false);
    syncStates(e);
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
      duration,
    } = {},
  }) => {
    const syncMedia =
      target === $video.current &&
      $audio &&
      $audio.current &&
      !isNaN($audio.current.duration)
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
      duration,
    });
  };

  /* Controls */
  const [seeking, setSeeking] = useState(false);
  const handleSeek = (e) => {
    const playAfterSeek = !$video.current.paused;
    setSeeking(true);
    console.log(
      `pbs: ${playAfterSeek} -> video paused: ${$video.current.paused}`
    );
    const seek = ({ clientX }) => {
      const { x, width } = $progress.current.getBoundingClientRect();
      const { duration, currentTime: videoTime } = $video.current;
      const currentTime = (((clientX - x) / width) * duration).toFixed(2);
      if (currentTime !== videoTime)
        setMediaState({
          currentTime:
            currentTime > duration
              ? duration
              : currentTime < 0
              ? 0
              : currentTime,
        });
    };

    const endSeek = () => {
      document.removeEventListener("mousemove", seek);
      document.removeEventListener("mouseup", endSeek);
      if (playAfterSeek) play();
      setSeeking(false);
    };

    document.addEventListener("mousemove", seek);
    document.addEventListener("mouseup", endSeek);
    pause();
    seek(e);
  };

  const [draggingVolume, setDraggingVolume] = useState(false);
  const handleVolumeDrag = (e) => {
    setDraggingVolume(true);
    const changeVolume = ({ clientY }) => {
      const { y, height } = $volume.current.getBoundingClientRect();
      const { volume } = $video.current;
      const newVolume = 1 - ((clientY - y) / height).toFixed(2);
      if (newVolume !== volume)
        setMediaState({
          volume: newVolume > 1 ? 1 : newVolume < 0 ? 0 : newVolume,
          muted: newVolume <= 0,
        });
    };

    const finish = () => {
      document.removeEventListener("mousemove", changeVolume);
      document.removeEventListener("mouseup", finish);
      setDraggingVolume(false);
    };

    document.addEventListener("mousemove", changeVolume);
    document.addEventListener("mouseup", finish);
    changeVolume(e);
  };

  const play = () => {
    [$video.current, $audio.current].forEach((media) => {
      if (media && !isNaN(media.duration)) media.play();
    });
  };

  const pause = () => {
    [$video.current, $audio.current].forEach((media) => {
      if (media && !isNaN(media.duration)) media.pause();
    });
  };

  /* Errors */
  const [error, setError] = useState(null);
  const updateError = (e) => {
    if (e && e.message) setError({ e, type: "video", name: "video" });
  };

  const devSpawnError = () =>
    setError({
      e: { message: "Fake error created by devSpawnError on Video" },
      type: "Dev",
      name: "dev",
    });

  const clearError = () => setError(null);

  useEffect(() => {
    if (error) pause();
  }, [error]);

  /* Fullscreen */
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (document.fullscreen) {
      document.exitFullscreen();
    } else {
      $wrapper.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement === $wrapper.current) setFullscreen(true);
      else if (fullscreen === true) setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  });

  /* Settings & visibility */

  const autoPlay = blur ? null : isGif;

  const showBigPlayButton = controls.currentTime === 0 && controls.paused;

  const showReplayButton = controls.ended;

  const [lockControls, setLockControls] = useState(false);
  const toggleLockControls = () => setLockControls((l) => !l);

  const [hovering, setHovering] = useState(false);
  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const [stillMouse, setStillMouse] = useState(false);
  const stillTimeout = useRef(() => {
    setTimeout(() => {
      setStillMouse(true);
    }, 2000);
  });
  const handleMouseMove = (e) => {
    setStillMouse(false);
    clearInterval(stillTimeout.current);
    stillTimeout.current = setTimeout(() => {
      setStillMouse(true);
    }, 2000);
  };

  const showControls =
    !error &&
    (draggingVolume ||
      seeking ||
      lockControls ||
      (hovering && !stillMouse) ||
      controls.paused);

  const [hoveringVolume, setHoveringVolume] = useState(false);
  const hoverVolume = () => setHoveringVolume(true);
  const stopHoverVolume = () => setHoveringVolume(false);

  const showVolume = draggingVolume || hoveringVolume;

  /* Debug */
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
    <DarkThemeProvider>
      <Wrapper
        ref={$wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        hideMouse={fullscreen && stillMouse && hovering && !controls.paused}
      >
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
          onClick={controls.paused ? play : pause}
          onError={updateError}
          onLoadedMetadata={syncStates}
          onPlay={syncStates}
          onPause={syncStates}
          onEnded={syncStates}
          onVolumeChange={syncStates}
          onRateChange={syncStates}
          onTimeUpdate={updateCurrentTime}
          onCanPlay={initialize}
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
        <Poster poster={poster} show={showBigPlayButton} />
        <Overlay show={showReplayButton}>
          <Icon icon="rotateCCW" size="xl" />
        </Overlay>
        <Overlay show={showBigPlayButton}>
          <Icon icon="play" size="xl" />
        </Overlay>
        <FullscreenInfo
          show={showControls}
          // show={fullscreen && showControls}
        >
          Fullscreen info
        </FullscreenInfo>
        <Controls show={showControls}>
          <ControlsBackground />
          <Section>
            <Button
              onClick={controls.paused ? play : pause}
              primary
              flat
              // toggle
              // toggled={controls.paused}
            >
              <Icon icon={controls.paused ? "play" : "pause"} />
            </Button>
            <Button
              onClick={setMediaState}
              value={{ loop: !controls.loop }}
              primary
              toggle
              flat
              toggled={controls.loop}
              label="loop"
              hideLabel
            >
              <Icon icon="repeat" />
            </Button>
            {hasAudio ? (
              <VolumePopout
                onMouseEnter={hoverVolume}
                onMouseLeave={stopHoverVolume}
                show={showVolume}
              >
                <Button
                  onClick={setMediaState}
                  value={{ muted: !controls.muted }}
                  flat
                  primary
                  toggle
                  nomargin
                  toggled={controls.muted}
                >
                  <Icon
                    icon={
                      controls.muted
                        ? "volumeX"
                        : controls.volume >= 0.66
                        ? "volume2"
                        : controls.volume >= 0.33
                        ? "volume1"
                        : "volume"
                    }
                  />
                </Button>

                <Volume
                  show={showVolume}
                  ref={$volume}
                  onMouseDown={handleVolumeDrag}
                >
                  <VolumeBar>
                    <VolumeSlider
                      muted={controls.muted}
                      volume={controls.volume}
                    />
                  </VolumeBar>
                </Volume>
              </VolumePopout>
            ) : null}
            <Time>{formatMs(Math.round(controls.currentTime))}</Time>
          </Section>
          <Seekbar ref={$progress} onMouseDown={handleSeek}>
            <Bar>
              <ProgressBar
                progress={
                  (controls.currentTime / controls.duration) * 100 + "%"
                }
              />
            </Bar>
          </Seekbar>
          <Section>
            <Time>{formatMs(Math.round(controls.duration))}</Time>
            <Dropdown
              label="Playback speed"
              hideLabel
              iconAfter="moreHorizontal"
              onSelect={setMediaState}
              up
              left
              flat
              primary
            >
              <Button
                value={{ playbackRate: 0.5 }}
                label="Slow (0.5x)"
                primary
                flat
                toggle
                toggled={controls.playbackRate === 0.5}
              />
              <Button
                value={{ playbackRate: 1 }}
                label="Normal (1.0x)"
                primary
                flat
                toggle
                toggled={controls.playbackRate === 1}
              />
              <Button
                value={{ playbackRate: 1.25 }}
                label="Fast (1.25x)"
                primary
                flat
                toggle
                toggled={controls.playbackRate === 1.25}
              />
              <Button
                value={{ playbackRate: 1.5 }}
                label="Faster (1.5x)"
                primary
                flat
                toggle
                toggled={controls.playbackRate === 1.5}
              />
              <Button
                value={{ playbackRate: 2 }}
                label="Ludicrous (2.0x)"
                primary
                flat
                toggle
                toggled={controls.playbackRate === 2}
              />
            </Dropdown>
            {process.env.NODE_ENV === "development" ? (
              <Dropdown
                hideLabel
                up
                left
                label="Debug menu"
                flat
                iconAfter="code"
                primary
              >
                <Button onClick={toggleLockControls}>
                  <Icon icon={lockControls ? "lock" : "unlock"} />
                  Lock controls
                </Button>
                <Button onClick={debugVideoToConsole}>
                  <Icon icon="terminal" />
                  Log video to console
                </Button>
                <Button onClick={setMediaState} value={{ currentTime: 0 }}>
                  <Icon icon="skipBack" />
                  Skip to beginning
                </Button>
                <Button
                  onClick={setMediaState}
                  value={{ currentTime: duration }}
                >
                  <Icon icon="skipForward" />
                  Skip to end
                </Button>
                <Button onClick={devSpawnError}>Spawn error</Button>
              </Dropdown>
            ) : null}
            {document.fullscreenEnabled ? (
              <Button
                onClick={toggleFullscreen}
                flat
                primary
                toggle
                toggled={fullscreen}
              >
                <Icon icon={fullscreen ? "minimize" : "maximize"} />
              </Button>
            ) : null}
          </Section>
        </Controls>
        {error ? (
          <Overlay show="true" usePointerEvents>
            <Error {...error} onClose={clearError} overlay />
          </Overlay>
        ) : null}
      </Wrapper>
    </DarkThemeProvider>
  );
};

export default Video;

const controlsHeight = 2; //em

const Wrapper = styled.div`
  max-width: inherit;
  height: 100%;
  width: 100%;
  margin: 0;
  display: block;
  cursor: ${({ hideMouse }) => (hideMouse ? "none" : "default")};
  &:hover {
    .controls {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const Seekbar = styled.div`
  width: auto;
  height: 1.5em;
  margin: auto 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border: none;
  left: 0;
  right: 0;
  flex: 1 1 auto;
  position: relative;
  &:hover > div {
    opacity: 1;
  }
`;

const Bar = styled.div`
  width: auto;
  height: 0.25em;
  margin: auto 0;
  border: none;
  border-radius: 0.25em;
  left: 0;
  right: 0;
  flex: 1 1 auto;
  position: relative;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.25);
  opacity: 0.8;
  transition: opacity 250ms ease;
`;

const ProgressBar = styled.div.attrs(({ progress }) => ({
  style: { width: progress },
}))`
  height: 0.25em;
  background-color: ${({ theme }) => theme.highlight};
  border-radius: 1em;
  box-shadow: 0 0 0.35em 0 ${({ theme }) => theme.focus.glow};
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
`;

const VolumeBar = styled(Bar)`
  width: 0.5em;
  height: 100%;
  margin: 0 auto;
`;

const VolumeSlider = styled(ProgressBar).attrs(({ volume, muted }) => ({
  style: { height: muted ? 0 : volume * 100 + "%" },
}))`
  width: 0.5em;
  box-shadow: none;
  top: unset;
  bottom: 0;
  /* transform: translateY(${({ show }) => (show ? "-5em" : "0")}); */
`;

const Volume = styled(Seekbar)`
  padding: 0.25em 0;
  background: ${({ theme }) => theme.card.bg};
  height: ${({ show }) => (show ? 5 : 0)}em;
  opacity: ${({ show }) => (show ? 1 : 0)};
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.75em;
  overflow: hidden;
  display: inline-block;
  transition: all 150ms ease-out;
  border-radius: 0.25em 0.25em 0 0;
`;

const VolumePopout = styled.div`
  display: inline-flex;
  flex-flow: column-reverse nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0.25em;
  margin-top: -0.25em;
  bottom: -0.125em;
`;

const ControlsBackground = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.card.bg};
  opacity: 0.85;
  z-index: 0;
`;

const Controls = styled.div`
  position: absolute;
  /* bottom: 0; */
  left: 0;
  right: 0;
  width: 100%;
  height: ${controlsHeight}em;
  color: white;
  padding: 0.125em 0.25em;
  display: flex;
  flex-flow: row nowrap;
  color: "#fff";
  opacity: ${({ show }) => (show ? 1 : 0)};
  bottom: ${({ show }) => (show ? "0%" : `-${controlsHeight}em`)};
  transition: all 250ms ease;
  font-size: 1.15em;
  backdrop-filter: blur(25px);
  user-select: none;
`;

const FullscreenInfo = styled(Controls)`
  user-select: auto;
  bottom: unset;
  height: auto;
  top: ${({ show }) => (show ? "0%" : `-${controlsHeight}em`)};
  background: linear-gradient(black, transparent);
`;

const Section = styled.div`
  flex: 0 0 auto;
  z-index: 1;
`;

const Time = styled.span`
  margin: 0 0.5em;
  font-size: 0.75em;
  color: white;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${({theme}) => theme.text};
  pointer-events: ${({ usePointerEvents }) =>
    usePointerEvents ? null : "none"};
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
  /* transition: opacity 0.5s ease; */
  animation: ${({ show }) => (show ? null : "expandFade 0.25s ease")};
  @keyframes expandFade {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
`;

const Poster = styled(Overlay)`
  opacity: 1;
  display: block;
  background: url(${({ poster }) => poster}) center no-repeat;
  background-size: contain;
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
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
