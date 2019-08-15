import { materialColors as colors } from "./material-design-color-palette";

const light = {
  dark: false,
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
  name: "Solarized Dark",
  icon: "Sunset",
  dark: true,
  color: colors.blueGrey100,
  titleColor: colors.white,
  card: {
    bg: colors.blueGrey900,
    innerBg: colors.blueGrey200,
    border: colors.blueGrey800,
    innerBorder: colors.blueGrey500,
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

const themes = { light, dark, blueDark };

export default themes;

export const lightThemes = { light };
export const darkThemes = { dark, blueDark };