import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeSpeed;
    word-wrap: break-word;
    box-sizing: border-box;
    margin: 0;
    font-size: 16px;
  }
  
  :root,
  html,
  body,
  #root,
  .app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  a {
  text-decoration: none;
  }
  
  * {
  box-sizing: inherit;
  }

  svg {
    color: inherit;
  }

  html {
    scroll-behavior: smooth;
  }
  
  span[data-tip]:hover {
    text-decoration: underline dotted;
    cursor: help;
  }
  
  /* react-tooltip */
  .tooltip {
  .multi-line {
    text-align: left !important;
    &:first-child {
      font-size: 0.9rem;
    }
    &:not(:first-child) {
      font-size: 0.75rem;
      font-style: italic;
      }
    }
  }
  /* Markdown bodies returned from reddit */
  .md {
    font-size: 0.9rem;
    line-height: 1.25rem;
    font-weight: 400;
    color: ${({ theme }) => (theme.dark ? "#fff" : "#000")};
    p {
      margin: 0.25em 0;
    }
    blockquote {
      margin: 0.5em;
      border-left: 0.25em solid grey;
      & > p {
        margin {
          margin: 0.25em 0.25em;
        }
      }
    }
  }
`;

export default GlobalStyle;
