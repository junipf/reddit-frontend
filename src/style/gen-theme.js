import {
  transparentize,
  hsl,
  parseToHsl,
  saturate,
  meetsContrastGuidelines,
} from "polished";
import themes from "./themes";

export const genSubIconColor = color => saturate(0.3, color);

const pickContrastingColor = (background, light, dark) => {
  if (light && meetsContrastGuidelines(background, light).AALarge) return light;
  if (meetsContrastGuidelines(background, "#fff").AALarge) return "#fff";
  if (dark && meetsContrastGuidelines(background, dark).AALarge) return dark;
  return "#000";
};

// secondary: {
//   color: colors.grey900,
//   bg: colors.grey300,
//   hover: colors.grey200,
//   active: colors.grey400,
// },
// flat: {
//   color: colors.grey900,
//   bg: "transparent",
//   hover: colors.grey200,
//   active: colors.grey300,
// },

export const genButtonColors = ({ color, dark, levels }) => {
  const theme = dark ? themes.dark : themes.light;
  if (!color || color === "") return { ...theme.button };

  const { hue, saturation } = parseToHsl(color);

  const lightText = hsl(hue, 0.8, 0.1);
  const darkText = hsl(hue, 0.8, 0.9);

  const mod = dark ? 0 : 0.5;

  let primary = {
    bg: hsl(hue, saturation, 0.6),
    hover: hsl(hue, saturation, 0.7),
    active: hsl(hue, saturation, 0.5),
  };
  primary.color = pickContrastingColor(primary.bg, lightText, darkText);

  let secondary = {
    bg: hsl(hue, 0.05, mod + 0.2),
    hover: hsl(hue, 0.05, mod + 0.3),
    active: hsl(hue, 0.05, mod + 0.1),
  };
  secondary.color = pickContrastingColor(secondary.bg, lightText, darkText);

  return { primary, secondary, flat: { ...secondary, bg: "transparent" } };
};

// 1, 0.618, 0.382, 0.236, 0.146, 0.09

const genTheme = ({ color, name, simple }) =>
  new Promise(resolve => {
    if (!color || color === "" || color === "transparent") return null;
    const { hue, saturation } = parseToHsl(color);
    const hueAdj = 11.25;
    const levels = {
      light: [
        simple ? themes.light.card.bg : hsl(hue + hueAdj, 0.075, 0.95),
        hsl(hue + hueAdj, 0.075, 0.9),
        hsl(hue + hueAdj, 0.075, 0.85),
        hsl(hue + hueAdj, 0.075, 0.8),
      ],
      dark: [
        simple ? themes.dark.card.bg : hsl(hue + hueAdj, 0.075, 0.16),
        hsl(hue + hueAdj, 0.075, 0.14),
        hsl(hue + hueAdj, 0.075, 0.12),
        hsl(hue + hueAdj, 0.075, 0.1),
      ],
    };
    const shared = {
      highlight: hsl(hue, saturation, 0.4),
      focus: {
        glow: transparentize(0.3, saturate(0.3, color)),
        border: color,
      },
    };
    const generatedThemes = {
      color: color,
      light: {
        ...themes.light,
        ...shared,
        name: `Light ${name || color}`,
        link: hsl(hue, 0.8, 0.35),
        color: hsl(hue, 0.8, 0.15),
        button: genButtonColors({ color, dark: false, levels: levels.light }),
        card: {
          ...themes.light.card,
          bg: levels.light[0],
          innerBg: levels.light[1],
          border: hsl(hue, saturation * 0.62, 0.62),
          innerBorder: hsl(hue, saturation * 0.38, 0.62),
        },
        column: {
          bg: hsl(hue + hueAdj, 0.05, 0.8),
        },
        header: {
          bg: hsl(hue, 0.05, 0.7),
          border: hsl(hue, saturation * 0.62, 0.75),
        },
      },
      dark: {
        ...themes.dark,
        ...shared,
        name: `Dark ${name || color}`,
        link: hsl(hue, 0.8, 0.85),
        color: hsl(hue, 0.8, 0.8),
        button: genButtonColors({ color, dark: true, levels: levels.dark }),
        card: {
          ...themes.dark.card,
          bg: levels.dark[0],
          innerBg: levels.dark[1],
          border: hsl(hue, 0.5, 0.22),
          innerBorder: hsl(hue, 0.25, 0.22),
        },
        column: {
          bg: hsl(hue + hueAdj, 0.05, 0.1),
        },
        header: {
          bg: hsl(hue + hueAdj, 0.05, 0.2),
          border: hsl(hue, saturation / 2, 0.5),
        },
      },
    };
    resolve(generatedThemes);
  });

export default genTheme;
