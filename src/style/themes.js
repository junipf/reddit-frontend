import { materialColors as colors } from "./material-design-color-palette";

const light = {
  dark: false,
  id: "light",
  name: "Day",
  icon: "Sun",
  highlight: colors.blue500,
  color: colors.grey900,
  titleColor: colors.black,
  link: colors.blue500,
  card: {
    bg: colors.white,
    innerBg: colors.grey200,
    border: colors.grey400,
    innerBorder: colors.grey300,
  },
  column: {
    bg: colors.grey100,
  },
  header: {
    bg: colors.grey200,
    border: colors.grey300,
  },
  scrollbar: colors.grey400 + " " + colors.grey300,
  focus: {
    glow: colors.blueA100,
    border: colors.blue500,
  },
  button: {
    primary: {
      color: colors.white,
      bg: colors.blue500,
      hover: colors.blue400,
      active: colors.blue600,
    },
    secondary: {
      color: colors.grey900,
      bg: colors.grey300,
      hover: colors.grey200,
      active: colors.grey400,
    },
    flat: {
      color: colors.grey900,
      bg: "transparent",
      hover: colors.grey200,
      active: colors.grey300,
    },
  },
  input: {
    color: colors.grey900,
    background: colors.white,
    border: colors.grey400,
  },
  tag: {
    stickied: colors.green700,
    restricted: colors.yellow800,
    quarantine: colors.orange700,
    hidden: colors.grey500,
    approved: colors.green600,
    removed: colors.red500,
    nsfw: colors.red500,
    oc: colors.teal500,
    spoiler: colors.grey500,
  },
  author: {
    submitter: colors.blue500,
    administrator: colors.red700,
    moderator: colors.green600,
  },
  subredditIcon: {
    dark: colors.grey800,
    light: colors.grey300,
  },
  votes: {
    up: "#ff4500",
    down: "#7193ff",
  },
  rainbow: [
    colors.red500,
    colors.orange500,
    colors.yellow500,
    colors.green500,
    colors.blue500,
    colors.indigo500,
    colors.purple500,
  ],
};

const dark = {
  ...light,
  name: "Night",
  icon: "Moon",
  id: "dark",
  dark: true,
  highlight: colors.blue400,
  color: colors.grey100,
  titleColor: colors.white,
  link: colors.blue400,
  card: {
    bg: colors.darkSurface200,
    innerBg: colors.darkSurface500,
    border: colors.darkSurface800,
    innerBorder: colors.darkSurface900,
  },
  column: {
    bg: colors.darkSurface50,
  },
  header: {
    bg: colors.darkSurface900,
    overlay: "transparent", //overridden by subreddit themes
    border: colors.darkSurface100,
  },
  scrollbar: colors.grey800 + " " + colors.grey700,
  focus: {
    glow: colors.blueA100,
    border: colors.blue500,
  },
  button: {
    primary: {
      color: colors.white,
      bg: colors.blue600,
      hover: colors.blue500,
      active: colors.blue700,
    },
    secondary: {
      color: colors.grey100,
      bg: colors.grey700,
      hover: colors.grey600,
      active: colors.grey800,
    },
    flat: {
      color: colors.grey100,
      bg: "transparent",
      hover: colors.grey600,
      active: colors.grey800,
    },
  },
  input: {
    color: colors.grey100,
    background: colors.grey900,
    border: colors.grey800,
  },
  tag: {
    ...light.tag,
    restricted: colors.yellow600,
    quarantine: colors.orange600,
    hidden: colors.grey400,
    approved: colors.green500,
  },
};

const blueDark = {
  ...dark,
  name: "Blue Dark",
  icon: "Sunset",
  id: "blueDark",
  dark: true,
  color: colors.blueGrey100,
  titleColor: colors.white,
  card: {
    bg: colors.blueGrey900,
    innerBg: colors.blueGrey700,
    border: colors.blueGrey600,
    innerBorder: colors.blueGrey800,
  },
  column: {
    bg: colors.blueGrey900,
  },
  header: {
    bg: colors.blueGrey800,
    border: colors.blueGrey700,
  },
  scrollbar: colors.blueGrey800 + " " + colors.blueGrey700,
  button: {
    primary: {
      color: colors.white,
      bg: colors.blue600,
      hover: colors.blue500,
      active: colors.blue700,
    },
    secondary: {
      color: colors.blueGrey100,
      bg: colors.blueGrey700,
      hover: colors.blueGrey600,
      active: colors.blueGrey800,
    },
    flat: {
      color: colors.blueGrey100,
      bg: "transparent",
      hover: colors.blueGrey600,
      active: colors.blueGrey800,
    },
  },
  input: {
    color: colors.blueGrey100,
    background: colors.blueGrey900,
    border: colors.blueGrey800,
  },
};

const reddit = {
  ...light,
  name: "reddit",
  id: "reddit",
  icon: "upvote",
  dark: false,
  color: "#222",
  titleColor: "#00f",
  link: "#00f",
  card: {
    bg: "white",
    border: "#808080",
    innerBg: "#fafafa",
    innerBorder: "#336699",
  },
  header: {
    bg: "#cee3f8",
    border: "#5f99cf",
  },
  button: {
    primary: {
      color: "#336699",
      bg: "#bdd4ea",
      hover: "#6a9fd1",
      active: "#5f99cf",
    },
    secondary: {
      color: "#222",
      bg: "#f0f6fd",
      hover: "#bdd4ea",
      active: "#6a9fd1",
    },
    flat: {
      color: "#222",
      bg: "transparent",
      hover: "#f0f6fd",
      active: "#bdd4ea",
    },
  },
 tag: {
   ...light.tag,
   stickied: "#228822",
   oc: "#0079d3",
   spoiler: "#222222",
   nsfw: "#d10023",
   restricted: "#ffd634",
   quarantine: "#ffd635", // Seriously, reddit?
 }
}

const themes = { light, dark, blueDark, reddit };

export default themes;

export const themeSets = [
  {
    name: "Light themes",
    dark: false,
    icon: "Sun",
    set: [light, reddit],
  },
  {
    name: "Dark themes",
    dark: true,
    icon: "Moon",
    set: [dark, blueDark],
  },
];
