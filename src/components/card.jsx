import styled from "styled-components";

export default styled.div`
  width: ${({ width }) => width || "auto"};
  margin: 1rem;
  padding: 0.5rem 0.8rem;
  background: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.card.border};
  border-radius: 0.25rem;
  transition: border-color 100ms ease;

  /* Clickable */
  cursor: ${({ clickable, onClick }) =>
    clickable || onClick ? "pointer" : null};
  &:hover {
    background-color: ${({ clickable, onClick, theme }) =>
      clickable || onClick ? theme.card.innerBg : null};
    border-color: ${({ clickable, onClick, theme }) =>
      clickable || onClick ? theme.primary.base : null};
  }
`;
