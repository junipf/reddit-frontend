import React, { useState } from "react";
import styled from "styled-components";
import Icon from "../components/icon";
import Button from "../components/button";
import Dropdown from "../components/dropdown";
import Tag from "../components/tags";

export const SectionCard = styled.section`
  margin: 1rem;
  margin-bottom: 0;
  background: ${({ theme }) => theme.card.bg};
  border: 1px solid ${({ theme }) => theme.card.border};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const Alignment = styled.h1`
  margin: 0;
  font-size: 100px;
  position: relative;
  border: 1px solid black;
  font-weight: 300;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0.2em;
    /* z-index: -1; */
    background: aqua;
    height: 2px;
    width: 100%;
    opacity: 0.5;
  }
`;

const DropdownHeader = styled.div`
  background: ${({ theme }) => theme.card.bg};
  border: 1px solid ${({ theme }) => theme.card.border};
  border-width: 1px 0;
  padding: 1rem 0;
  margin: 1rem 0;
`;
const Center = styled.div`
  text-align: center;
  display: inline-block;
  width: 100%;
`;
const FloatRight = styled.div`
  float: right;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: 50px 50px 50px;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
`;

const HighlightedIcon = styled(Icon)`
  outline: 1px solid pink;
`;

const DropdownTest = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((e) => !e);
  const [hideLabels, setHideLabels] = useState(true);
  const toggleHideLabels = () => setHideLabels((h) => !h);
  return (
    <>
      <h1>Dropdowns</h1>
      <DropdownHeader>
        <Dropdown label="Dropdown">
          <Button label="Spacer" />
          <Dropdown label="Dropdown">
            <Button label="Spacer" />
            <Dropdown label="Dropdown">
              <Button label="Spacer" />
              <Dropdown label="Dropdown">
                <Button label="Spacer" />
                <Dropdown label="Dropdown">
                  <Button label="Spacer" />
                  <Dropdown label="Dropdown">
                    <Button label="Spacer" />
                    <Dropdown label="Dropdown">
                      <Button label="Spacer" />
                      <Dropdown label="Dropdown">
                        <Button label="Spacer" />
                        <Dropdown label="Dropdown">
                          <Button label="Spacer" />
                          <Dropdown label="Dropdown">
                            <Button label="Spacer" />
                            <Button label="Found me!" />
                            <Button label="Spacer" />
                          </Dropdown>
                        </Dropdown>
                      </Dropdown>
                    </Dropdown>
                  </Dropdown>
                </Dropdown>
              </Dropdown>
            </Dropdown>
          </Dropdown>
        </Dropdown>
        <FloatRight>
          <Dropdown label="Dropdown">
            <Dropdown label="Dropdown">
              <Dropdown label="Dropdown">
                <Dropdown label="Dropdown">
                  <Dropdown label="Dropdown">
                    <Dropdown label="Dropdown">
                      <Dropdown label="Dropdown">
                        <Dropdown label="Dropdown">
                          <Dropdown label="Dropdown">
                            <Dropdown label="Dropdown">
                              <Button label="Found me!" />
                            </Dropdown>
                          </Dropdown>
                        </Dropdown>
                      </Dropdown>
                    </Dropdown>
                  </Dropdown>
                </Dropdown>
              </Dropdown>
            </Dropdown>
          </Dropdown>
        </FloatRight>
      </DropdownHeader>
      <SectionCard>
        <Button onClick={toggleOpen}>
          <Icon icon={open ? "minimize2" : "maximize2"} />
          {open ? "Close" : "Open"}
        </Button>
        <Button onClick={toggleHideLabels}>
          <Icon icon="type" />
          {hideLabels ? "Show labels" : "Hide labels"}
        </Button>
        <Grid>
          <Dropdown label="up left" up left open={open} hideLabel={hideLabels}>
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="up center"
            up
            center
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="up right"
            up
            right
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="left center"
            left
            center
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="center open"
            center
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="right center"
            right
            center
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="down left"
            down
            left
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="down center"
            down
            center
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown
            label="down right"
            down
            right
            open={open}
            hideLabel={hideLabels}
          >
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
        </Grid>
        <Center>
          <Dropdown label="Expando" iconAfter="maximize" expand>
            <Button label="spacer" />
            <Button label="spacer" />
          </Dropdown>
          <Dropdown hideLabel>Overflow!</Dropdown>
        </Center>
      </SectionCard>
    </>
  );
};

export const TagTest = () => (
  <>
    <h1>Tags</h1>
    <SectionCard>
      <p>
        <Tag.NSFW />
        <Tag.Spoiler />
        <Tag.OC />
        <Tag.Quarantine />
        <Tag.Stickied />
        <Tag.Hidden />
        <Tag.Archived />
        <Tag.Locked />
        <Tag.Approved />
        <Tag.Removed />
      </p>
    </SectionCard>
  </>
);

const ComponentsTest = () => (
  <>
    <DropdownTest />
    <TagTest />
    <h1>Buttons</h1>
    <SectionCard>
      <h2>Types</h2>
      <Button type="primary">Primary</Button>
      <Button type="primary" color="#32b58d">
        Custom color!
      </Button>
      <Button type="primary" color="#ffffaa">
        Super bright custom color!
      </Button>
      <Button>Button</Button>
      <Button type="flat">Flat</Button>
      <h2>Icons</h2>
      <Button hideLabel label="With icon, label hidden!" icon="star" />
      <Button label="Icon, label!" icon="lock" />
      <Button
        label="Everything!"
        data-tip="Completely separate tooltip!"
        icon="star"
      />
    </SectionCard>
    <h1>SVG Alignment</h1>
    <SectionCard>
      <Alignment>
        Align
        <HighlightedIcon icon="triangle" noMargin />
        <HighlightedIcon icon="square" noMargin />
        <HighlightedIcon icon="circle" noMargin />
        <HighlightedIcon icon="trendingUp" noMargin />
      </Alignment>
    </SectionCard>
  </>
);

export default ComponentsTest;
