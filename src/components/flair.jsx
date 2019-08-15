import React from "react";
import styled from "styled-components";

const Emoji = styled.div.attrs(({url}) => ({
  style: { backgroundImage: "url(" + url + ")" },
}))`
  padding: 0;
  width: 1.25em;
  height: 1.25em;
  display: inline-block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  vertical-align: text-bottom;
  border: none;
  outline: none;
`;

const Text = styled.span``;

const StyledFlair = styled.span`
  margin-right: 0.25em;
  display: inline-block;
  padding: ${({ backgroundColor }) =>
    backgroundColor === "transparent" ? "0" : "0 0.4em"};
  font-size: inherit;
  font-weight: 400;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.125rem;
  color: ${({ backgroundColor, theme, color }) =>
    backgroundColor === "transparent"
      ? theme.color
      : theme.flairColor || color || theme.color};
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor || theme.card.innerBg};
`;

const Flair = ({
  color = "dark", // "dark" or "light"
  backgroundColor = "transparent",
  templateId,
  type, // "richText" or "text"
  text,
  richText,
}) => {
  // richText format:
  //  [
  //   0: {
  //     u: URL to emoji img
  //     e: type (emoji, text)
  //     a: emoji text (:example:)
  //     t: text string
  //   },
  //   ...]

  const bgColor = backgroundColor === "" ? "transparent" : backgroundColor;

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
      <StyledFlair
        backgroundColor={bgColor}
        color={color === "light" ? "#fff" : "#000"}
        id={templateId}
      >
        {content}
      </StyledFlair>
    );
  else return null;
};

export default Flair;
