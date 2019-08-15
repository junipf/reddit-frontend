import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Reply from "../components/reply";
import Comment from "../containers/comment";
import ReactTooltip from "react-tooltip";
import { SectionCard } from "./components-test";

const md = require("markdown-it")({ html: true });

const examples = [
  {
    body_html: md.render(`# H1
  
## H2

### H3

#### H4

##### H5

###### H6
  `),
    created_utc: Date.now() / 1000,
  },
  {
    body_html: md.render(`| num | center | right |
| :-- | :--: | --: |
| 0 | c |  r |
| 1 | c |  r |
| 2 | c |  r |
| 3 | c |  r |`),
    created_utc: Date.now(),
  },
  {
    body_html: md.render(`**Bold** *Italic* ~~Strikethrough~~

[link](https://localhost:3000/)

>Quote

>!Spoiler text!<
    `),
    created_utc: Date.now(),
  },
  {
    body_html: md.render(`    const blockCode = () => {}
    
And \`inline code\` here`),
    created_utc: Date.now(),
  },
];
const Flex = styled.div`
  display: flex;
  flex-flow: row wrap;
  /* margin: 0.25rem; */
  & > * {
    flex: 1 1 auto;
    margin: 0.25rem;
  }
`;

const MarkdownTest = (props) => {
  const [replies, setReplies] = useState([...examples]);
  const handleSubmit = (value) =>
    setReplies((r) => [
      ...r,
      {
        body_html: md.render(value),
        created_utc: 0,
      },
    ]);
  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  return (
    <>
      <SectionCard>
        <Reply onSubmit={handleSubmit} autoFocus />
      </SectionCard>
      <Flex>
        {replies.map(({ body_html, created_utc }, i) => (
          <SectionCard key={i}>
            <Comment
              comment={{
                permalink: "#",
                id: i,
                author: { name: "Comment" },
                depth: 0,
                score: 1,
                score_hidden: false,
                edited: false,
                created_utc,
                body_html,
                distinguished: false,
                is_submitter: false,
                likes: 0,
                saved: false,
                hidden: false,
                replies: [],
                collapse: false,
                author_flair_type: "",
                author_flair_text: "",
                author_flair_template_id: "",
                author_flair_richtext: "",
                author_flair_text_color: "",
                author_flair_background_color: "",
              }}
            />
          </SectionCard>
        ))}
      </Flex>
    </>
  );
};

export default MarkdownTest;
