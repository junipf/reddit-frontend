import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Button, { buttonMargin, Group } from "./button";
import Dropdown from "./dropdown";
import Icon from "./icon";
import Error from "./error";
import formatMs from "../utils/format-ms";
import DarkThemeProvider from "../style/dark-theme-provider";

export default ({
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
  title,
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

  const setMediaState = (state, media = [$video.current, $audio.current]) =>
    media.forEach((media) => {
      if (!media || isNaN(media.duration)) return;
      Object.entries(state).forEach(([key, value]) => {
        if (media[key] !== value) {
          media[key] = value;
          setControlsState({ [key]: value });
        }
      });
    });

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
          volume: !muted && volume === 0 ? prevVolume : volume,
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
  const [prevVolume, setPrevVolume] = useState(0.5);
  const handleVolumeDrag = (e) => {
    setDraggingVolume(true);
    setPrevVolume($video.current.volume);
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

  // useEffect(() => {
  //   if (!controls.muted && controls.volume === 0)
  //     setMediaState({ volume: prevVolume });
  // }, [controls.muted, controls.volume, prevVolume, setMediaState]);

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

  const showBigPlayButton =
    !blur && controls.currentTime === 0 && controls.paused;

  const showReplayButton = !blur && controls.ended;

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
    !blur &&
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

  const playbackRates = [0.5, 1, 1.25, 1.5, 2.0];
  // const playbackRates = [
  //   ["Slow", 0.5],
  //   ["Normal", 1],
  //   ["Fast", 1.25],
  //   ["Faster", 1.5],
  //   ["Ludicrous", 2.0],
  // ];

  const rateIndex = playbackRates.indexOf(controls.playbackRate);

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
          onDoubleClick={toggleFullscreen}
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
        <Poster blur={blur} poster={poster} show={showBigPlayButton} />
        <Overlay show={showReplayButton}>
          <Icon icon="rotateCCW" size="xl" />
        </Overlay>
        <Overlay show={showBigPlayButton}>
          <Icon icon="play" size="xl" />
        </Overlay>
        <FullscreenInfo show={fullscreen && showControls}>
          {title}
        </FullscreenInfo>
        <Controls show={showControls}>
          <ControlsBackground />
          <Section>
            <Button
              onClick={controls.paused ? play : pause}
              primary
              flat
              // toggled={controls.paused}
            >
              <Icon icon={controls.paused ? "play" : "pause"} />
            </Button>
            {hasAudio ? (
              <VolumePopout
                onMouseEnter={hoverVolume}
                onMouseLeave={stopHoverVolume}
                show={showVolume}
                className="button"
              >
                <Button
                  onClick={setMediaState}
                  value={{ muted: !controls.muted }}
                  flat
                  primary
                  noMargin
                  toggled={controls.muted}
                >
                  <Icon
                    icon={
                      controls.muted
                        ? "volumeX"
                        : controls.volume >= 0.75
                        ? "volume2"
                        : controls.volume >= 0.25
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
              label="Options"
              hideLabel
              iconAfter="moreHorizontal"
              up
              left
              flat
              primary
            >
              <Button
                onClick={setMediaState}
                value={{ loop: !controls.loop }}
                primary
                flat
                toggled={controls.loop}
                label="loop"
                hideLabel
              >
                <Icon icon="repeat" />
              </Button>
              <Group>
                <Button
                  flat
                  primary
                  onClick={setMediaState}
                  disabled={rateIndex === 0}
                  align="center"
                  value={{
                    playbackRate:
                      rateIndex === 0
                        ? playbackRates[playbackRates.length - 1]
                        : playbackRates[rateIndex - 1],
                  }}
                >
                  <Icon icon="minusCircle" />
                </Button>
                <Button
                  flat
                  primary
                  toggled={controls.playbackRate === 1}
                  onClick={setMediaState}
                  align="center"
                  value={1}
                >
                  {`${controls.playbackRate.toFixed(2)}x`}
                </Button>
                <Button
                  flat
                  primary
                  onClick={setMediaState}
                  disabled={rateIndex === playbackRates.length - 1}
                  align="center"
                  value={{
                    playbackRate:
                      rateIndex === playbackRates.length - 1
                        ? playbackRates[0]
                        : playbackRates[rateIndex + 1],
                  }}
                >
                  <Icon icon="plusCircle" />
                </Button>
              </Group>
              {/* Speed
              {[
                ["Slow (0.5x)", 0.5],
                ["Normal (1.0x)", 1.0],
                ["Fast (1.25x)", 1.25],
                ["Faster (1.5x)", 1.5],
                ["Ludicrous (2.0x)", 2.0],
              ].map(([label, playbackRate]) => (
                <Button
                  value={{ playbackRate }}
                  label={label}
                  primary
                  flat
                  toggled={controls.playbackRate === playbackRate}
                />
              ))} */}
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

// Gif converted to video (post.preview.images[0].variants.mp4)
// Does not come with is_gif and uses different src names
export const Gif = ({
  video: {
    width,
    height,
    url,
    hls_url: hlsUrl,
    dash_url: dashUrl,
    fallback_url: fallbackUrl,
  },
  blur,
}) => {
  const [paused, setPaused] = useState(false);
  const handleClick = (e) => {
    if (e.target.paused) e.target.play();
    else e.target.pause();
    setPaused(e.target.paused);
  };
  return (
    <GifWrapper>
      <StyledGif
        autoPlay={!blur}
        muted
        controls={false}
        preload={blur ? "auto" : null}
        loop={true}
        height={height}
        width={width}
        onClick={handleClick}
        blur={blur}
      >
        <source src={url} />
        <source src={hlsUrl} type="application/vnd.apple.mpegURL" />
        <source src={dashUrl} />
        <source src={fallbackUrl} />
        Gif failed to load
      </StyledGif>
      <Overlay show={paused}>
        <Icon icon="pause" size="xl" />
      </Overlay>
    </GifWrapper>
  );
};

const controlsHeight = 1.75; //em

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
  margin: auto 0.75em;
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
  background-color: ${({ theme }) => theme.focus.border};
  border-radius: 1em;
  box-shadow: 0 0 0.3em 0 ${({ theme }) => theme.focus.glow};
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
`;

const Volume = styled(Seekbar)`
  margin: 0;
  padding: 0.25em 0;
  background: ${({ theme }) => theme.card.bg};
  height: ${({ show }) => (show ? 5 : 0)}em;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  overflow: hidden;
  display: inline-block;
  transition: all 150ms ease-out;
  border-radius: 0.25em 0.25em 0 0;
`;

const VolumePopout = styled.div`
  position: relative;
  display: inline-block;
  ${buttonMargin};
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
  display: flex;
  flex-flow: row nowrap;
  color: "#fff";
  opacity: ${({ show }) => (show ? 1 : 0)};
  bottom: ${({ show }) => (show ? "0%" : `-${controlsHeight}em`)};
  transition: all 250ms ease;
  /* font-size: 1.25em; */
  font-size: 1rem;
  backdrop-filter: blur(25px);
  user-select: none;
`;

const FullscreenInfo = styled(Controls)`
  user-select: auto;
  bottom: unset;
  height: 3rem;
  top: ${({ show }) => (show ? 0 : -3)}em;
  background: linear-gradient(black, transparent);
`;

const Section = styled.div`
  flex: 0 0 auto;
  z-index: 1;
  display: inline-block;
`;

const Time = styled.span`
  font-size: 0.75em;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${({ theme }) => theme.text};
  pointer-events: ${({ usePointerEvents }) =>
    usePointerEvents ? null : "none"};
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
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
  filter: ${({ blur }) => (blur ? "blur(20px)" : null)};
`;

const StyledVideo = styled.video`
  max-width: inherit;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background-color: black;
  filter: ${({ blur }) => (blur ? "blur(20px)" : null)};
`;

const StyledGif = styled(StyledVideo)`
  background-color: ${({ theme }) => theme.card.innerBg};
  filter: ${({ blur }) => (blur ? "blur(20px)" : null)};
`;

const GifWrapper = styled(Wrapper)`
  width: auto;
`;

const Audio = styled.audio`
  /* display: none; */
  width: 100%;
  position: absolute;
  bottom: 40px;
`;
