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

const pickContrastingColor = (background, light = "#fff", dark = "#000") => {
  if (meetsContrastGuidelines(background, light).AALarge) return light;
  if (meetsContrastGuidelines(background, "#fff").AALarge) return "#fff";
  if (meetsContrastGuidelines(background, dark).AALarge) return dark;
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

export function genTheme(color, dark) {
  if (!color || color === "" || color === "transparent") {
    return null;
  }
  const { hue, saturation } = parseToHsl(color);
  const modFg = dark ? 0.65 : 0;
  const container = {
    color: hsl(hue, 0.8, modFg + 0.15),
      titleColor: hsl(hue, saturation, modFg + 0.25),
      border: transparentize(0.6, color),
      innerBorder: transparentize(0.7, color),
      link: hsl(hue, 0.8, modFg + 0.25),
      levels: [
        adjustHue(11.25, hsl(hue, dark ? 0.075 : 0.75, dark ? 0.16 : 0.95)),
        adjustHue(11.25, hsl(hue, dark ? 0.075 : 0.75, dark ? 0.14 : 0.90)),
        adjustHue(11.25, hsl(hue, dark ? 0.075 : 0.75, dark ? 0.12 : 0.85)),
      ],
  }
  const button = genButtonColors(color, dark, container);
  return {
    dark,
    main: color,
    container,
    button,
    highlight: hsl(hue, saturation, modFg + 0.4),
    ...inheritables,
  };
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
        saturation,
        0.975
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
