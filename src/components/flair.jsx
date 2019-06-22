import React from "react";
import styled from "styled-components";

const Emoji = styled.div.attrs(props => ({
  style: { backgroundImage: "url(" + props.url + ")" },
}))`
  padding: 0;
  width: 1.3125em;
  height: 1.3125em;
  display: inline-block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  vertical-align: text-bottom;
  border: none;
  outline: none;
`;

const Text = styled.span``;

const Flair = styled.span`
  margin-right: 0.25em;
  display: inline-block;
  padding: ${props =>
    props.backgroundColor === "transparent" ? "0" : "0.25em 0.4em"};
  font-size: inherit;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  color: ${props =>
    props.backgroundColor === "transparent"
      ? props.theme.container.color
      : props.color || props.theme.container.color};
  background-color: ${props =>
    props.backgroundColor || props.theme.container.levels[2]};
`;

const ConstructFlair = props => {
  const {
    color = "dark", // "dark" or "light"
    backgroundColor = "transparent",
    templateId,
    type, // "richText" or "text"
    text,
    richText,
    //  [
    //   0: {
    //     u: URL to emoji img
    //     e: type (emoji, text)
    //     a: emoji text (:example:)
    //     t: text string
    //   },
    //   ...]
  } = props;

  const content =
    type === "richtext"
      ? richText.map(({ e: type, t: text, u: url, a: emojiText }, i) =>
          type === "emoji" ? (
            <Emoji url={url} data-tip={emojiText} key={i} />
          ) : type === "text" && text !== "" ? (
            <Text key={i}>{text}</Text>
          ) : null
        )
      : type === "text"
      ? text
      : null;

  if (content)
    return (
      <Flair
        backgroundColor={backgroundColor}
        color={color === "light" ? "#fff" : "#000"}
        id={templateId}
      >
        {content}
      </Flair>
    );
  else return null;
};

export default ConstructFlair;
