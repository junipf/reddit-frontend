import React, { useEffect } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { setLocation } from "./../store/actions";
import { Column } from "../containers/column";

// import pages
import ComponentsTest from "./components-test";
import IconPage from "./icon-page";
import MarkdownTest from "./markdown-test";
import Post from "../containers/post";
import posts from "./sample-posts";
import ThemesTest from "./themes-test";

const VideoPost = () => (
  <>
    <h1>Reddit video</h1>
    <Post post={posts.videoAudio} compact />
  </>
);

const TwitterPost = () => (
  <>
    <h1>Twitter embed</h1>
    <Post post={posts.tweet} compact />
  </>
);

const VideoGifPost = () => (
  <>
    <h1>Gif (video)</h1>
    <Post post={posts.videoIsGif} compact />
  </>
);

const VideoNoAudio = () => (
  <>
    <h1>Video no audio</h1>
    <Post post={posts.videoNoAudio} compact />
  </>
);

const Page = styled.div`
  width: 100%;
  margin: 0 auto;
`;

export const tests = {
  components: { name: "Components", Component: ComponentsTest, icon: "square" },
  icon: { name: "Icon", Component: IconPage, icon: "search" },
  markdown: { name: "Markdown", Component: MarkdownTest, icon: "italic" },
  themes: { name: "Themes", Component: ThemesTest, icon: "layout" },
  video: { name: "Video", Component: VideoPost, icon: "video" },
  "video-no-audio": {
    name: "Video No Audio",
    Component: VideoNoAudio,
    icon: "volumeX",
  },
  gif: { name: "Gif", Component: VideoGifPost, icon: "repeat" },
  tweet: { name: "Tweet", Component: TwitterPost, icon: "twitter" },
};

const TestPage = ({ setLocation }) => {
  useEffect(() => {
    setLocation({ name: "Test", type: "other" });
  }, [setLocation]);
  return (
    <Column>
      <Page>
        <Switch>
          {Object.entries(tests).map(([key, { name, Component }]) => (
            <Route
              path={`/test/${name.toLowerCase().replace(/ /g, "-")}`}
              component={Component}
              key={name}
            />
          ))}
        </Switch>
      </Page>
    </Column>
  );
};

export default connect(
  null,
  { setLocation }
)(TestPage);
