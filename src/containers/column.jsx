import styled from "styled-components";

export default styled.div`
  scroll-behavior: smooth;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  overflow-x: hidden;
  flex: 1 1 ${({ type }) =>
    type === "primary" ? "62vw" : type === "secondary" ? "38vw" : "auto"};
  scrollbar-color: ${({ theme }) => theme.scrollbar};
  transition: flex-basis 250ms ease-in-out;
  position: relative;
  &.hidden {
    /* animation: 250ms ease slide-out; */
      flex: 0 0 0;
  }
  /* @keyframes slide-out {
    from {
      flex: 1 1 ${({ type }) =>
    type === "primary" ? "62vw" : type === "secondary" ? "38vw" : "auto"};
    }
    to {
      flex: 0 0 0;
    }
  } */
`;