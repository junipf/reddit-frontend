import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import themes from "../style/themes";
import Tag from "../components/tags";
import genTheme from "../style/gen-theme";
import Button from "../components/button";
import Icon from "../components/icon";
import Dropdown from "../components/dropdown";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  border-width: 10px 0;
`;

const Flex = styled(Grid)`
  display: flex;
  flex-flow: row wrap;
  flex: 1 1 300px;
`;

const Column = styled.div`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  & a {
    color: ${({ theme }) => theme.link};
  }
  scrollbar-color: ${({ theme }) => theme.scrollbar};
  width: 100%;
  height: 100%;
  padding-bottom: 3rem;
  flex: 1 1 200px;
`;

const SectionCard = styled.section`
  margin: 1rem;
  background: ${({ theme }) => theme.card.bg};
  border: 1px solid ${({ theme }) => theme.card.border};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const Dot = styled.div`
  display: inline-block;
  border-radius: 50%;
  margin: 0.125em;
  width: 1em;
  height: 1em;
  border: 1px solid grey;
  background-color: ${({ color }) => color};
  cursor: pointer;
`;

const Header = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.header.border};
  background-color: ${({ theme }) => theme.header.bg};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  opacity: 1;
  position: relative;
`;

const HeaderSection = styled.section`
  display: flex;
  flex-direction: inherit;
  align-items: center;
  height: inherit;
  margin: 0.25rem;
  z-index: 10;
`;

const ThemeSet = styled(SectionCard)`
  flex: 1 0 450px;
  padding: 0;
  overflow: hidden;
`;

const SetCard = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
`;

const Section = styled.section`
  margin: 1rem 0;
`;

const Inner = styled(SectionCard)`
  border-color: ${({ theme }) => theme.card.innerBorder};
  background-color: ${({ theme }) => theme.card.innerBg};
  text-align: center;
`;

const Media = styled.div`
  width: calc(100% + 2rem);
  margin: 0 -1rem;
  text-align: center;
  padding: 1rem;
  height: 3rem;
  background-color: black;
`;

const SampleComponents = ({ children }) => (
  <Column>
    <Header>
      <HeaderSection>{children}</HeaderSection>
    </Header>
    <SectionCard>
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
      <div>
        <Button>Button</Button>
        <Button primary>Primary</Button>
        <Button flat>Flat</Button>
        <Dropdown label="Dropdown">
          <Button>Content</Button>
        </Dropdown>
      </div>
      <p>
       Text and <a href="/#?*">a link</a>
      </p>
      <Inner>InnerBg/InnerBorder</Inner>
      <Media>Media</Media>
    </SectionCard>
  </Column>
);

const ThemesTest = () => {
  const [value, setValue] = useState("#00ff80");
  const [themesFromColors, setThemesFromColors] = useState({});

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const addColor = (color = value) => {
    if (themesFromColors[color]) return;
    genTheme({ color }).then((result) =>
      setThemesFromColors((t) => ({ ...t, [color]: result }))
    );
  };

  const removeColor = (value) => {
    if (themesFromColors[value])
      setThemesFromColors((t) => ({ ...t, [value]: undefined }));
  };

  const toggleColor = (value) =>
    themesFromColors[value] ? removeColor(value) : addColor(value);

  const clearColors = () => {
    setThemesFromColors({});
  };

  const reGenThemes = () =>
    Object.keys(themesFromColors).forEach((color) =>
      genTheme({ color }).then((result) =>
        setThemesFromColors((t) => ({ ...t, [color]: result }))
      )
    );

  return (
    <>
      <Section>
        <Flex>
          <ThemeSet>
            <SetCard>
              {Object.entries(themes).map(([name, theme], i) => (
                <ThemeProvider theme={theme} key={i + "builtin"}>
                  <SampleComponents>{`Built in ${name}`}</SampleComponents>
                </ThemeProvider>
              ))}
            </SetCard>
          </ThemeSet>
        </Flex>
      </Section>
      <Section>
        <Header>
          <HeaderSection>
            Custom theme generation
            <input
              type="color"
              id="theme"
              name="theme"
              value={value}
              onChange={handleChange}
            />
            <Button onClick={addColor} data-tip="Add color">
              <Icon icon="plus" />
            </Button>
            <Button onClick={clearColors} data-tip="Clear all colors">
              <Icon icon="x" />
            </Button>
            <Button onClick={reGenThemes} data-tip="Regenerate themes">
              <Icon icon="refreshCW" />
            </Button>
          </HeaderSection>
          <HeaderSection>
            {["#00ff86", "#20df85", "#40bf83", "#609f82", "#7a8581"].map((color) => (
              <Button onClick={toggleColor} value={color}>
                <Dot color={color} />
                <Icon icon="plus" />
              </Button>
            ))}
          </HeaderSection>
          <HeaderSection>
            {themes.light.rainbow.map((color) => (
              <Button onClick={toggleColor} value={color}>
                <Dot color={color} />
                <Icon icon="plus" />
              </Button>
            ))}
          </HeaderSection>
        </Header>
        <Flex>
          {Object.entries(themesFromColors).map(([color, themes], i) => {
            if (themes)
              return (
                <ThemeProvider theme={themes.light}>
                  <ThemeSet key={i + "gen"}>
                    <div>
                      <Button
                        onClick={removeColor}
                        value={color}
                        fill
                        primary
                      >
                        <Dot color={color} />
                        {color}
                      </Button>
                    </div>
                    <SetCard>
                      <SampleComponents>{`Light ${color}`}</SampleComponents>
                      <ThemeProvider theme={themes.dark}>
                        <SampleComponents>{`Dark ${color}`}</SampleComponents>
                      </ThemeProvider>
                    </SetCard>
                  </ThemeSet>
                </ThemeProvider>
              );
            return null;
          })}
        </Flex>
      </Section>
    </>
  );
};

export default ThemesTest;
