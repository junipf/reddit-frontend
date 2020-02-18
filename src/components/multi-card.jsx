import React from "react";
import styled from "styled-components";
import Icon from "./icon";
import Card from "./card";

const User = styled.div`
  width: 100%;
  line-height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  height: 4rem;
  width: 4rem;
  border-radius: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.25rem;
  line-height: 1.35rem;
`;

const Line = styled.div`
  font-size: 1rem;
  line-height: 1.25rem;
`;

const Info = styled.div`
  height: 3.5rem;
  margin: 0.5rem 0.75rem;
`;

export default ({ m }) => {
  const cakeday = new Date(m.created * 1000);
  return (
    <Card>
      <User>
        <Avatar src={m.icon_url} alt={m.name} />
        <Info>
          <Name>{m.display_name}</Name>
          <Line>Created by {m.owner}</Line>
          <Line
            data-multiline="true"
            data-tip={`Multireddit created <br /> ${cakeday.toLocaleString()}`}
          >
            <Icon icon="calendar" inline marginRight />
            {cakeday.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Line>
        </Info>
      </User>
    </Card>
  );
};
