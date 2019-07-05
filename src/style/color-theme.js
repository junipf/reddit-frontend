const colors = {
  magenta50: "#ff1ad9",
  magenta60: "#ed00b5",
  magenta70: "#b5007f",
  magenta80: "#7d004f",
  magenta90: "#440027",
  purple30: "#c069ff",
  purple40: "#ad3bff",
  purple50: "#9400ff",
  purple60: "#8000d7",
  purple70: "#6200a4",
  purple80: "#440071",
  purple90: "#25003e",
  blue40: "#45a1ff",
  blue50: "#0a84ff",
  blue50a30: "rgba(10, 132, 255, 0.3)",
  blue60: "#0060df",
  blue70: "#003eaa",
  blue80: "#002275",
  blue90: "#000f40",
  teal50: "#00feff",
  teal60: "#00c8d7",
  teal70: "#008ea4",
  teal80: "#005a71",
  teal90: "#002d3e",
  green50: "#30e60b",
  green60: "#12bc00",
  green70: "#058b00",
  green80: "#006504",
  green90: "#003706",
  yellow50: "#ffe900",
  yellow60: "#d7b600",
  yellow70: "#a47f00",
  yellow80: "#715100",
  yellow90: "#3e2800",
  red50: "#ff0039",
  red60: "#d70022",
  red70: "#a4000f",
  red80: "#5a0002",
  red90: "#3e0200",
  orange50: "#ff9400",
  orange60: "#d76e00",
  orange70: "#a44900",
  orange80: "#712b00",
  orange90: "#3e1300",
  grey10: "#f9f9fa",
  grey10a10: "rgba(249, 249, 250, 0.1)",
  grey10a20: "rgba(249, 249, 250, 0.2)",
  grey10a40: "rgba(249, 249, 250, 0.4)",
  grey10a60: "rgba(249, 249, 250, 0.6)",
  grey10a80: "rgba(249, 249, 250, 0.8)",
  grey20: "#ededf0",
  grey30: "#d7d7db",
  grey40: "#b1b1b3",
  grey50: "#737373",
  grey60: "#4a4a4f",
  grey70: "#38383d",
  grey80: "#2a2a2e",
  grey90: "#0c0c0d",
  grey90a05: "rgba(12, 12, 13, 0.05)",
  grey90a10: "rgba(12, 12, 13, 0.1)",
  grey90a20: "rgba(12, 12, 13, 0.2)",
  grey90a30: "rgba(12, 12, 13, 0.3)",
  grey90a40: "rgba(12, 12, 13, 0.4)",
  grey90a50: "rgba(12, 12, 13, 0.5)",
  grey90a60: "rgba(12, 12, 13, 0.6)",
  grey90a70: "rgba(12, 12, 13, 0.7)",
  grey90a80: "rgba(12, 12, 13, 0.8)",
  grey90a90: "rgba(12, 12, 13, 0.9)",
  ink70: "#363959",
  ink80: "#202340",
  ink90: "#0f1126",
  white100: "#ffffff",
  black100: "#000000",
};

const infoIcon = {
  sticky: colors.green70,
  restricted: colors.yellow60,
  quarantine: colors.orange50,
  hidden: colors.grey40,
  modApproved: colors.green60,
  modRemoved: colors.red50,
};

const tag = {
  nsfw: {
    bg: colors.red60,
    fg: colors.white100,
  },
  oc: {
    bg: colors.teal60,
    fg: colors.white100,
  },
  spoiler: {
    bg: colors.grey60,
    fg: colors.white100,
  },
};

const author = {
  submitter: colors.blue50,
  administrator: colors.red70,
  moderator: colors.green60,
};

const subredditIcon = {
  dark: colors.grey80,
  light: colors.grey30,
};

export const inheritables = { infoIcon, tag, author, subredditIcon };

const light = {
  dark: false,
  // [Normal, :hover, :active]
  main: colors.blue50,
  container: {
    color: colors.grey90,
    titleColor: colors.black100,
    border: colors.grey40,
    innerBorder: colors.grey30,
    link: colors.blue50,
    levels: [colors.white100, colors.grey10, colors.grey20],
  },
  column: {
    background: colors.grey20,
  },
  scrollbar: colors.grey40 + " " + colors.grey30,
  // Button themes are self-contained to be transparently overwritten.
  button: {
    primary: {
      color: [colors.white100, colors.white100, colors.white100],
      levels: [colors.blue50, colors.blue40, colors.blue60],
      focus: colors.blue50a30,
    },
    secondary: {
      color: [colors.grey90, colors.grey90, colors.grey90],
      levels: [colors.grey20, colors.grey10, colors.grey30],
      focus: colors.blue50a30,
    },
    flat: {
      color: [colors.grey80, colors.grey90, colors.grey90],
      levels: ["transparent", colors.grey20, colors.grey30],
      focus: colors.blue50a30,
    },
  },
  input: {
    color: colors.grey90,
    background: colors.white100,
    border: colors.grey40,
    focusBorder: colors.blue50,
    focus: colors.blue50a30,
  },
  ...inheritables,
};

const dark = {
  dark: true,
  // [Normal, :hover, :active]
  main: colors.blue40,
  container: {
    color: colors.grey10,
    titleColor: colors.white100,
    border: colors.grey60,
    innerBorder: colors.grey70,
    link: colors.blue40,
    levels: [colors.grey80, colors.grey70, colors.grey60],
  },
  column: {
    background: colors.grey90,
  },
  scrollbar: colors.grey80 + " " + colors.grey70,
  // Button themes are self-contained to be transparently overwritten.
  button: {
    primary: {
      color: [colors.white100, colors.white100, colors.white100],
      levels: [colors.blue60, colors.blue50, colors.blue70],
      focus: colors.blue50a30,
    },
    secondary: {
      color: [colors.grey10, colors.grey10, colors.grey10],
      levels: [colors.grey70, colors.grey60, colors.grey80],
      focus: colors.blue50a30,
    },
    flat: {
      color: [colors.grey10, colors.grey10, colors.grey10],
      levels: ["transparent", colors.grey60, colors.grey80],
      focus: colors.blue50a30,
    },
  },
  input: {
    color: colors.grey10,
    background: colors.black100,
    border: colors.grey80,
    focusBorder: colors.blue50,
    focus: colors.blue50a30,
  },
  ...inheritables,
};

export const themes = { light, dark };
