import React, { useState } from "react";
import styled from "styled-components";
import Icon from "../components/icon";
import icons from "../icons";
import Button from "../components/button";
import Dropdown from "../components/dropdown";
import Input from "../components/input";

const presets = [
  {
    name: "UI",
    icon: "menu",
    description: "Simple UI elements.",
    terms: [
      "-box",
      "-file",
      "-folder",
      "-hexagon",
      "-maximize",
      "-user",
      "-volume",
      "alert",
      "check",
      "chevron",
      "load",
      "maximize",
      "minimize",
      "minus",
      "plus",
      "power",
      "sidebar",
      "slash",
      "toggle",
      "chart",
      "x",
      "command",
    ],
  },
  {
    name: "Skeuomorphic UI",
    icon: "file",
    description: "UI elements that are skeuomorphic.",
    terms: [
      "-creditcard",
      "-headphones",
      "-mappin",
      "-shopping",
      "-smartphone",
      "-facebook",
      "activity",
      "archive",
      "award",
      "bell",
      "book",
      "briefcase",
      "calendar",
      "camera",
      "cloud",
      "edit",
      "file",
      "filter",
      "flag",
      "folder",
      "inbox",
      "map",
      "mic",
      "phone",
      "pin",
      "save",
      "scissors",
      "search",
      "settings",
      "shield",
      "shopping",
      "sliders",
      "target",
      "trash",
      "user",
      "flag",
      "film",
      "eye",
      "crosshair",
      "creditcard",
      "droplet",
      "compass",
      "gift",
      "image",
      "home",
      "link",
      "lifebuoy",
    ],
  },
  {
    name: "Directions",
    icon: "arrowRight",
    description: "Arrows",
    terms: [
      "up",
      "down",
      "left",
      "right",
      "-load",
      "-align",
      "-toggle",
      "-corner",
    ],
  },
  {
    name: "Shapes",
    icon: "circle",
    description: "Shapes",
    terms: ["circle", "square", "octagon", "triangle", "star"],
  },
  {
    name: "Custom",
    icon: "logo",
    description: "Custom icons for the reddit react frontend project",
    terms: ["logo", "vote", "pin", "-logout", "-map", "-shopping"],
  },
  {
    name: "Logos",
    icon: "twitter",
    terms: [
      "-logout",
      "codepen",
      "codesandbox",
      "facebook",
      "github",
      "instagram",
      "gitlab",
      "linkedin",
      "logo",
      "chrome",
      "figma",
      "feather",
      "pocket",
      "slack",
      "trello",
      "twitter",
      "youtube",
    ],
  },
  {
    name: "Media",
    icon: "play",
    terms: ["volume", "video", "shuffle", "skip", "rewind", "repeat", "rotate"],
  },
  {
    name: "Devices",
    icon: "smartphone",
    terms: [
      "headphones",
      "mic",
      "server",
      "smartphone",
      "speaker",
      "tablet",
      "tv",
      "camera",
      "cpu",
      "disc",
      "",
    ],
  },
  {
    name: "Type",
    icon: "type",
    terms: [
      "-creditcard",
      "align",
      "bold",
      "delete",
      "edit",
      "italic",
      "scissors",
      "type",
      "underline",
    ],
  },
  {
    name: "Emoji",
    icon: "smile",
    terms: ["smile", "frown", "meh", "thumbs"],
  },
  {
    name: "Layout",
    icon: "layout",
    terms: ["layout", "sidebar", "layers", "grid", "column"],
  },
];

const IconFlex = styled.div`
  display: flex;
  flex-flow: row wrap;
  & > * {
    display: inline-block;
    text-align: center;
  }
  & figure {
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
    margin: 1rem;
    flex: 1 1 10%;
  }
`;

const Card = styled.div`
  margin: 0.75rem;
  /* margin-bottom: 0; */
  background: ${({ theme }) => theme.card.bg};
  border: 1px solid ${({ theme }) => theme.card.border};
  color: ${({ theme }) => theme.text};
  border-radius: 0.5rem;
  flex: 1 1 auto;
`;

const Sticky = styled.div`
  background: ${({ theme }) => theme.card.bg};
  border-bottom: 1px solid ${({ theme }) => theme.card.border};
  color: ${({ theme }) => theme.text};
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  /* max-width: 800px; */
  padding: 1rem 1rem 0;
  margin: 0 auto;
`;

const Search = styled.div``;

const Tags = styled.div`
  max-height: 10rem;
  overflow-y: auto;
  scrollbar-width: thin;
  margin: 0 0.35em;
  & button {
    margin: 0 0.25em 0.35em 0.25em;
    border-radius: 0.45em;
  }
`;

const Highlight = styled.span`
  background-color: ${({ theme }) => theme.highlight};
`;

const StyleSettings = styled.div`
  margin: 0.5em;
`;

const Content = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  & > * {
    display: inline-block;
    text-align: center;
  }
`;

const IconPage = (props) => {
  const [fill, setFill] = useState(false);
  const toggleFill = () => setFill((f) => !f);
  const [thin, setThin] = useState(false);
  const toggleThin = () => setThin((t) => !t);
  const [large, setLarge] = useState(true);
  const toggleLarge = () => setLarge((l) => !l);
  const [labels, setLabels] = useState(true);
  const toggleLabels = () => setLabels((l) => !l);

  const [value, setValue] = useState("");
  const [terms, setTerms] = useState([]);
  const [filters, setFilters] = useState([]);

  const handleInput = (e) => {
    const newValue = e.target.value;
    if (newValue.endsWith(" ") && newValue.length > 1) {
      // addTerm(value.split(" "));
      const truncatedValue = newValue.replace(" ", "");
      setTerms((terms) => [...terms, truncatedValue]);
      if (newValue.startsWith("-") && !(truncatedValue in filters))
        setFilters((filters) => [...filters, truncatedValue]);
      setValue(" ");
    } else {
      setValue(newValue);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === "Space") submit(e.target.value);
    if (e.key === "Backspace" && value === " ") {
      setValue(terms[terms.length - 1]);
      removeTerm(terms[terms.length - 1]);
    }
  };

  const usePreset = (terms) => submit(terms.join(" "), true);

  const clearAll = () => {
    setTerms([]);
    setFilters([]);
    setValue("");
  };

  const submit = (value, clear) => {
    if (value && value !== "") {
      let newFilters = [];
      let newTerms = [];
      value.split(" ").forEach((word) => {
        if (word === "" || word === "-") return;
        if (word.charAt(0) === "-" && !filters.includes(word.slice(1)))
          newFilters.push(word.slice(1));
        else if (!terms.includes(word)) newTerms.push(word);
      });
      if (newFilters.length > 0)
        setFilters((filters) =>
          clear ? newFilters : [...filters, ...newFilters]
        );
      if (newTerms.length > 0)
        setTerms((terms) => (clear ? newTerms : [...terms, ...newTerms]));
      setValue("");
    }
  };

  const removeTerm = (term) =>
    setTerms((terms) => terms.filter((t) => t !== term));
  const removeFilter = (filter) =>
    setFilters((fs) => fs.filter((f) => f !== filter));

  const filterIcons = (term) =>
    Object.keys(icons).reduce((filtered, key, i, array) => {
      if (
        key.includes(term) &&
        !filters
          .map((filter) => key.includes(filter) && filter !== term)
          .includes(true)
      ) {
        filtered.push(
          <figure key={key}>
            <Icon
              icon={key}
              size={large ? "xl" : "normal"}
              thin={thin}
              fill={fill}
            />
            {labels ? (
              term !== "" ? (
                <figcaption>
                  {key.slice(0, key.indexOf(term))}
                  <Highlight>{term}</Highlight>
                  {key.slice(key.indexOf(term) + term.length, key.length)}
                </figcaption>
              ) : (
                <figcaption>{key}</figcaption>
              )
            ) : null}
          </figure>
        );
      } else if (i === array.length - 1 && filtered.length === 0) {
        filtered.push(
          <figure key={key}>
            <figcaption>{`No results for "${term}"`}</figcaption>
          </figure>
        );
      }
      return filtered;
    }, []);

  return (
    <>
      <Sticky>
        <Search>
          <Input
            placeholder="Search"
            onChange={handleInput}
            onKeyDown={handleKeyPress}
            onSubmit={submit}
            value={value}
            type="search"
            size="large"
            before={terms.map(
              (term) => (
                // term !== "" && (
                <Button
                  onClick={removeTerm}
                  value={term}
                  key={term}
                  size="small"
                >
                  {term}
                </Button>
              )
              // )
            )}
            wide
          >
            <Dropdown
              fill
              label=""
              flat
              onSelect={usePreset}
              data-tip="Presets"
            >
              {presets.map(({ name, icon, terms }) => (
                <Button value={terms} key={name}>
                  <Icon icon={icon} />
                  {name}
                </Button>
              ))}
              <Button
                value={Array(1000)
                  .fill()
                  .map((v, i) => i)}
                key="thousand"
              >
                <Icon icon="loader" />0 - 999
              </Button>
            </Dropdown>
            <Button
              flat
              fill
              icon="x"
              onClick={clearAll}
              label="Clear all"
              hideLabel
            />
            <Button
              icon="search"
              label="Submit"
              fill
              hideLabel
              value={value}
              onClick={submit}
            />
          </Input>
          {terms.length > 0 || filters.length > 0 ? (
            <Tags>
              {filters.map((filter) => (
                <Button
                  onClick={removeFilter}
                  value={filter}
                  key={filter}
                  size="small"
                >
                  <Icon icon="minus" />
                  {filter}
                </Button>
              ))}
            </Tags>
          ) : null}
        </Search>
        <StyleSettings>
          {[
            { toggle: fill, onClick: toggleFill, desc: "Fill" },
            { toggle: thin, onClick: toggleThin, desc: "Thin" },
            { toggle: large, onClick: toggleLarge, desc: "Large" },
            { toggle: labels, onClick: toggleLabels, desc: "Labels" },
          ].map(({ toggle, onClick, desc }) => (
            <Button onClick={onClick} key={desc}>
              <Icon icon={toggle ? "checkSquare" : "square"} />
              {desc}
            </Button>
          ))}
        </StyleSettings>
      </Sticky>
      <Content>
        {value && value.length > 0 && value !== " " && value !== "-"
          ? value.split(" ").map((word) =>
              word.length > 0 ? (
                <Card key={word}>
                  <IconFlex>{filterIcons(word)}</IconFlex>
                </Card>
              ) : null
            )
          : null}
        {terms.length === 0 && filters.length === 0 && value.length === 0 ? (
          <Card>
            <IconFlex>{filterIcons("")}</IconFlex>
          </Card>
        ) : (
          terms.map((term) =>
            term.startsWith("-") ? null : (
              <Card key={term}>
                <IconFlex>{filterIcons(term)}</IconFlex>
              </Card>
            )
          )
        )}
      </Content>
    </>
  );
};

export default IconPage;
