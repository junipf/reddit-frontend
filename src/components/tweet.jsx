import React, {  useEffect, useRef} from "react";
import styled, { css, withTheme } from "styled-components";

const StyledIframe = styled.iframe`
  filter: ${({blur}) => (blur ? "blur(50px)" : null)};
  border: none;
  width: 100%;
  overflow: hidden;
  /* position: absolute; */
  /* top: 0; */
`;

const Tweet = ({ blur, src, width, title, theme, id, ...props }) => {
  const $iframe = useRef(null);

  const shadowStyle = css`
    a.CallToAction {
      display: none;
    }
    .EmbeddedTweet {
      margin: 0;
    }
  `;

  const srcStyle = css`
    body {
      margin: 0;
      overflow: hidden;
    }
    #tweet {
      width: 100vw;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }
  `;

  const srcDoc = `
  <meta
  name="twitter:dnt"
  content="on">
  <meta
  name="twitter:widgets:autoload"
  content="off">
  <script>window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
  
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
  
    return t;
  }(document, "script", "twitter-wjs"));</script>
  
  <style type="text/css">
  ${srcStyle}
  </style>
  
  <div id="tweet" />
  `;

  // @import url("https://platform.twitter.com/css/tweet.9bf5093a19cec463852b31b784bf047a.dark.ltr.css");

  //@import url("https://platform.twitter.com/css/tweet.9bf5093a19cec463852b31b784bf047a.light.ltr.css");
  
  const handleLoad = () => {
    if (
      !$iframe.current ||
      !$iframe.current.contentDocument ||
      !$iframe.current.contentWindow.twttr
    )
      return;

    const doc = $iframe.current.contentDocument;
    const twitter = $iframe.current.contentWindow.twttr;
    const tweet = $iframe.current.contentDocument.getElementById("tweet");

    doc.body.style.margin = 0;

    if (twitter) {
      twitter.ready(() => {
        twitter.widgets
          .createTweet(id, tweet, {
            align: "center",
            theme: theme.dark ? "dark" : "light",
          })
          .then((newTweet) => {
            newTweet.style.marginTop = 0;
            newTweet.style.marginBottom = 0;
            const style = doc.createElement("style");
            style.type = "text/css";
            style.innerText = shadowStyle;
            newTweet.shadowRoot.append(style);
            $iframe.current.height = newTweet.clientHeight;
          });
      });
    }
  }

  useEffect(() => {
    if (!$iframe.current || !$iframe.current.contentDocument) return;

    $iframe.current.contentDocument
      .querySelectorAll("twitter-widget")
      .forEach((twitterWidget) => {
        twitterWidget.shadowRoot.querySelectorAll("style").forEach((style) => {
          const matches = style.innerText.match(/(@import.*)(light|dark)(.*)/);
          if (matches)
            style.innerText = `${matches[1]}${
              matches[2] === "light" ? "dark" : "light"
            }${matches[3]}`;
        });
      });
  }, [theme.dark]);

  return (
    <StyledIframe
      ref={$iframe}
      onLoad={handleLoad}
      srcDoc={srcDoc}
      title="Tweet"
    />
  );
};

export default withTheme(Tweet);
