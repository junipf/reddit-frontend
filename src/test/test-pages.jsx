import React from "react";
import styled from "styled-components";
import Helper from "../components/helper";
import Icon from "../components/icon";
import Button from "../components/button";
import { Banner } from "../components/banners";
import Dropdown from "../components/dropdown";

const Column = styled.div`
  width: 100%;
  overflow-y: scroll;
`;

const TestPage = styled.div`
  width: 100%
  margin: 0 auto;
`;

const SectionCard = styled.section`
  margin: 1rem;
  margin-bottom: 0;
  background: ${props => props.theme.container.levels[0]};
  color: ${props => props.theme.container.color};
  border: 1px solid ${props => props.theme.container.border};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Title2 = styled.h2`
  font-size: 1.35rem;
`;

const Alignment = styled.h1`
  font-size: 100px;
  position: relative;
  border: 1px solid black;
  font-weight: 300;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0.265em;
    /* z-index: -1; */
    background: aqua;
    height: 2px;
    width: 100%;
    opacity: 0.5;
  }
`;

const handleClick = e => console.log(e.target + " clicked!");

export const ComponentTestPage = () => (
  <Column>
    <TestPage>
      <SectionCard>
        <Banner
          type="quarantine"
          icon="AlertTriangle"
          label="Quarantine"
          data-tip="This community is quarantined."
          key="0"
        />
        <Banner
          type="restricted"
          icon="Archive"
          label="Archived"
          data-tip="This post has been archived. You won't be able to comment or vote."
          key="1"
        />
        <Banner
          type="restricted"
          icon="Lock"
          label="Locked"
          data-tip="This post has been locked. You won't be able to comment."
          key="2"
        />
        <Banner
          type="hidden"
          icon="EyeOff"
          label="Hidden"
          data-tip="This post is hidden, so it isn't in any listing."
          key="3"
        />
        <Banner
          type="nsfw"
          icon="Coffee"
          label="NSFW"
          data-tip="Not Safe For Work"
          key="4"
        />
        <Banner
          type="spoiler"
          icon="alert"
          label="Spoiler"
          data-tip="This post contains spoilers"
          key="5"
        />
        <Banner type="mod-removed" icon="x" label={"Removed!"} key="6" />
        <Banner type="mod-approved" icon="check" label={"Approved!"} key="7" />
      </SectionCard>
      <SectionCard>
        <Dropdown label="Dropdown!">
          <Button onClick={handleClick}>Item 1!</Button>
          <Button onClick={handleClick}>Item 2!</Button>
          <Button onClick={handleClick}>Item 3!</Button>
          Text item!
        </Dropdown>
        <Dropdown toggle={<Button type="flat" label="Dropdown" hideLabel />}>
          <Button onClick={handleClick}>Item 1!</Button>
          <Button onClick={handleClick}>Item 2!</Button>
          <Button onClick={handleClick}>Item 3!</Button>
          Text item!
        </Dropdown>
      </SectionCard>
      <SectionCard>
        <Title>Helper</Title>
        <Helper icon="info" data-tip="!" data-delay-show={0} />
        <Helper icon="info" data-tip="This is a tip!" data-delay-show={0} />
        <Helper
          icon="alert"
          data-tip="Reddit video doesn't support audio!"
          data-delay-show={0}
        />
        <Helper icon="info" data-tip="!" data-delay-show={0} />
      </SectionCard>
      <SectionCard>
        <Title>Buttons</Title>

        <Title2>Types</Title2>

        <Button type="primary">Primary</Button>

        <Button type="primary" color="#32b58d">
          Custom color!
        </Button>

        <Button type="primary" color="#ffffaa">
          Super bright custom color!
        </Button>

        <Button>Button</Button>

        <Button type="flat">Flat</Button>

        <Title2>Icons</Title2>

        <Button hideLabel label="With icon, label hidden!" icon="star" />

        <Button label="Icon, label!" icon="lock" />

        <Button
          label="Everything!"
          data-tip="Completely separate tooltip!"
          icon="star"
        />
      </SectionCard>
      <SectionCard>
        <Title>SVG Alignment</Title>
        <Alignment>
          Align
          <Icon icon="collapse" noMargin />
          <Icon icon="moon" noMargin />
          <Icon icon="all" noMargin />
          <Icon icon="popular" noMargin />
          <Icon icon="home" noMargin />
        </Alignment>
      </SectionCard>
    </TestPage>
  </Column>
);
