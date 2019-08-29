import styled from "styled-components";

const Card = styled.div`
  width: ${({ width }) => width || "auto" };
  margin: 0.5rem;
  background: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.text};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.card.border};
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

export default Card;