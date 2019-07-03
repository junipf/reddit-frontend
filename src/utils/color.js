import {
  transparentize,
  hsl,
  parseToHsl,
  saturate,
  meetsContrastGuidelines,
  adjustHue,
} from "polished";
import { themes, inheritables } from "../style/color-theme";

export const genSubIconColor = color => saturate(0.3, color);

const pickContrastingColor = (background, light, dark) => {
  if (light && meetsContrastGuidelines(background, light).AALarge) return light;
  if (meetsContrastGuidelines(background, "#fff").AALarge) return "#fff";
  if (dark && meetsContrastGuidelines(background, dark).AALarge) return dark;
  return "#000";
};

export function genButtonColors(color, dark, container) {
  if (!color || color === "") {
    return {
      levels: [],
      focus: null,
      color: [],
      primary: {
        levels: [],
        focus: null,
        color: [],
      },
    };
  }
  const { hue, saturation } = parseToHsl(color);
  const lightText = hsl(hue, 0.8, 0.1);
  const darkText = hsl(hue, 0.8, 0.9);

  const focus = transparentize(0.3, saturate(0.3, color));

  const mod = dark ? 0 : 0.5;

  let primary = {
    levels: [
      hsl(hue, saturation, mod + 0.2),
      hsl(hue, saturation, mod + 0.3),
      hsl(hue, saturation, mod + 0.1),
    ],
    focus: focus,
  };
  primary.color = [
    pickContrastingColor(primary.levels[0], lightText, darkText),
    pickContrastingColor(primary.levels[1], lightText, darkText),
    pickContrastingColor(primary.levels[2], lightText, darkText),
  ];

  let secondary = {
    levels: [
      hsl(hue, saturation, mod + 0.3),
      hsl(hue, saturation, mod + 0.4),
      hsl(hue, saturation, mod + 0.2),
    ],
    focus: focus,
  };
  secondary.color = [
    pickContrastingColor(secondary.levels[0], lightText, darkText),
    pickContrastingColor(secondary.levels[1], lightText, darkText),
    pickContrastingColor(secondary.levels[2], lightText, darkText),
  ];
  
  let flat = {
    levels: ["transparent", secondary.levels[0], secondary.levels[1]],
    focus: focus,
  };
  flat.color = [
    pickContrastingColor(container.levels[0], lightText, darkText),
    secondary.color[1],
    secondary.color[2],
  ];

  return { primary, secondary, flat };
}

const genThemeLight = (color) => {
  const { hue, saturation } = parseToHsl(color);
  const container = {
    ...themes.light.container,
    color: hsl(hue, 0.8, 0.15),
    titleColor: hsl(hue, saturation, 0.25),
    border: transparentize(0.6, color),
    innerBorder: transparentize(0.7, color),
    link: hsl(hue, 0.8, 0.25),
    levels: [
      adjustHue(11.25, hsl(hue, 0.75, 0.95)),
      adjustHue(11.25, hsl(hue, 0.75, 0.90)),
      adjustHue(11.25, hsl(hue,  0.75, 0.85)),
    ],
  };
  const button = genButtonColors(color, false, container);
  return {
    ...themes.light,
    main: color,
    dark: false,
    container,
    button,
    flairColor: pickContrastingColor(color),
    highlight: hsl(hue, saturation, 0.4),
    ...inheritables,
  };
}

const genThemeDark = (color) => {
  const { hue, saturation } = parseToHsl(color);
  const container = {
    ...themes.dark.container,
    color: hsl(hue, 0.8, 0.8),
    titleColor: hsl(hue, saturation, 0.9),
    border: transparentize(0.6, color),
    innerBorder: transparentize(0.7, color),
    link: hsl(hue, 0.8, 0.85),
    levels: [
      adjustHue(11.25, hsl(hue, 0.075, 0.16)),
      adjustHue(11.25, hsl(hue, 0.075, 0.14)),
      adjustHue(11.25, hsl(hue, 0.075, 0.12)),
    ],
  };
  const button = genButtonColors(color, false, container);
  return {
    ...themes.dark,
    main: color,
    dark: true,
    container,
    button,
    flairColor: pickContrastingColor(color),
    highlight: hsl(hue, saturation, 0.4),
    ...inheritables,
  };
}

export function genTheme(color) {
  if (!color || color === "" || color === "transparent") return null;
  return {
    color: color,
    light: genThemeLight(color),
    dark: genThemeDark(color),
  }
}


const genSubThemeLight = (color) => {
  const { hue, saturation } = parseToHsl(color);
  const container = {
    ...themes.light.container,
    border: transparentize(0.6, color),
    innerBorder: transparentize(0.7, color),
    link: hsl(hue, 0.8, 0.35),
    levels: [
      adjustHue(11.25, hsl(hue, 0.75, 0.95)),
      adjustHue(11.25, hsl(hue, 0.75, 0.90)),
      adjustHue(11.25, hsl(hue,  0.75, 0.85)),
    ],
  };
  const button = genButtonColors(color, false, container);
  return {
    ...themes.light,
    main: color,
    dark: false,
    container,
    button,
    highlight: hsl(hue, saturation, 0.4),
    column: {
      background: hsl(
        hue,
        saturation /2,
        0.98
      ),
    },
    ...inheritables,
  };
}

const genSubThemeDark = (color) => {
  const { hue, saturation } = parseToHsl(color);
  const container = {
    ...themes.dark.container,
    border: transparentize(0.6, color),
    innerBorder: transparentize(0.7, color),
    link: hsl(hue, 0.8, 0.85),
    levels: [
      adjustHue(11.25, hsl(hue, 0.075, 0.16)),
      adjustHue(11.25, hsl(hue, 0.075, 0.14)),
      adjustHue(11.25, hsl(hue, 0.075, 0.12)),
    ],
  };
  const button = genButtonColors(color, false, container);
  return {
    ...themes.dark,
    main: color,
    dark: true,
    container,
    button,
    highlight: hsl(hue, saturation, 0.4),
    column: {
      background: hsl(
        hue,
        saturation,
        0.05
      ),
    },
    ...inheritables,
  };
}

export function genSubredditTheme(color) {
  if (!color || color === "" || color === "transparent") return null;
  return {
    color: color,
    light: genSubThemeLight(color),
    dark: genSubThemeDark(color),
  }
}
