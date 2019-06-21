import {
  // darken,
  transparentize,
  // readableColor,
  hsl,
  rgba,
  parseToHsl,
  // setSaturation,
  saturate,
  meetsContrastGuidelines,
  // complement,
  adjustHue,
} from "polished";
import { inheritables } from "../style/color-theme";

export const genSubIconColor = color => saturate(0.3, color);

const pickContrastingColor = (background, light = "#fff", dark = "#000") => {
  if (meetsContrastGuidelines(background, light).AALarge) return light;
  if (meetsContrastGuidelines(background, "#fff").AALarge) return "#fff";
  if (meetsContrastGuidelines(background, dark).AALarge) return dark;
  if (meetsContrastGuidelines(background, "#000").AALarge) return "#000";
};

export function genButtonColors(color, dark) {
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
    pickContrastingColor(flat.levels[0], lightText, darkText),
    pickContrastingColor(flat.levels[1], lightText, darkText),
    pickContrastingColor(flat.levels[2], lightText, darkText),
  ];

  return { primary, secondary, flat };
}

export function genTheme(color, dark) {
  if (!color || color === "" || color === "transparent") {
    return null;
  }
  const { hue, saturation } = parseToHsl(color);
  const modFg = dark ? 0.65 : 0;
  return {
    dark,
    main: color,
    container: {
      color: hsl(hue, 0.8, modFg + 0.15),
      titleColor: hsl(hue, saturation, modFg + 0.25),
      border: transparentize(0.6, color),
      innerBorder: transparentize(0.7, color),
      link: hsl(hue, 0.8, modFg + 0.25),
      levels: [
        "radial-gradient(circle at top left, " +
          hsl(hue, saturation, dark ? 0.1 : 0.8) +
          " 75%, " +
          adjustHue(22.5, hsl(hue, saturation, dark ? 0.1 : 0.8)) +
          " 100%)",
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.1),
        // transparentize(0.7, hsl(hue, saturation, dark ? 0.125 : 0.96)),
        // transparentize(0.7, hsl(hue, saturation, dark ? 0.15 : 0.94)),
      ],
    },
    button: genButtonColors(color, dark),
    highlight: hsl(hue, saturation, modFg + 0.4),
    ...inheritables,
  };
}

export function genSimpleTheme(color, dark) {
  if (!color || color === "" || color === "transparent") {
    return null;
  }
  const { hue, saturation } = parseToHsl(color);
  const modFg = dark ? 0.5 : 0;
  return {
    container: {
      border: transparentize(0.6, color),
      innerBorder: transparentize(0.7, color),
      link: hsl(hue, 0.8, modFg + 0.35),
    },
    button: genButtonColors(color, dark),
    highlight: hsl(hue, saturation, modFg + 0.4),
    column: {
      background: hsl(
        hue,
        dark ? saturation / 2 : saturation,
        dark ? 0.1 : 0.9
      ),
    },
  };
}
