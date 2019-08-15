import React, { useEffect } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { setLocationName } from "./../store/actions";
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

const Page = styled.div`
  width: 100%
  margin: 0 auto;
`;

export const tests = [
  { name: "Components", Component: ComponentsTest, icon: "square" },
  { name: "Icon", Component: IconPage, icon: "search" },
  { name: "Markdown", Component: MarkdownTest, icon: "italic" },
  { name: "Themes", Component: ThemesTest, icon: "layout" },
  { name: "Video", Component: VideoPost, icon: "video" },
  { name: "Gif", Component: VideoGifPost, icon: "repeat" },
  { name: "Tweet", Component: TwitterPost, icon: "twitter" },
];

const TestPage = ({ setLocationName }) => {
  useEffect(() => {
    setLocationName("Test");
  }, [setLocationName]);
  return (
    <Column>
      <Page>
        <Switch>
          {tests.map(({ name, Component }) => (
            <Route
              path={`/test/${name.toLowerCase()}`}
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
  { setLocationName }
)(TestPage);
