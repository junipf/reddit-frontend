import styled from "styled-components";

export const Column = styled.div`
  scroll-behavior: smooth;
  background-color: ${props => props.theme.column.background};
  overflow-x: hidden;
  overflow-y: ${props => (props.lightboxIsOpen ? "hidden" : "scroll")};
  flex: 1 1 auto;
  scrollbar-color: ${props => props.theme.scrollbar};
`;

export const Sidebar = styled.div`
  background-color: ${props => props.theme.container.levels[1]};
  &:first-child {
    border-right: 1px solid ${props => props.theme.container.border};
  }
  &:last-child {
    border-left: 1px solid ${props => props.theme.container.border};
  }
  overflow: hidden;
  height: inherit;
  flex: 0 0 ${props => props.collapse ? "3.2rem" : "14rem"};
`;