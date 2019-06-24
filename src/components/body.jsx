import React from "react";
import styled from "styled-components";

export const Text = styled.div`
  margin: 1rem 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
`;
export const Body = props => {
  const { selftext_html } = props;
  return <Text dangerouslySetInnerHTML={{ __html: selftext_html }} />;
};
