import {
  transparentize,
  hsl,
  parseToHsl,
  saturate,
  // meetsContrastGuidelines,
  readableColor,
} from "polished";
import themes from "./themes";

export const genSubIconColor = (color) => saturate(0.3, color);

export const genThemeSync = ({ color, name, simple }) => {
  if (!color || color === "" || color === "transparent") return null;
  const { hue, saturation: sat, lightness: lum } = parseToHsl(color);
  const hueAdj = hue + 11.25;
  const satAdj = sat < 0.02 ? sat : 0.075;
  const levels = {
    light: [
      simple ? themes.light.card.bg : hsl(hueAdj, satAdj, 0.95),
      hsl(hueAdj, satAdj, 0.9),
      hsl(hueAdj, satAdj, 0.85),
      hsl(hueAdj, satAdj, 0.8), 
    ],
    dark: [
      simple ? themes.dark.card.bg : hsl(hueAdj, satAdj, 0.16),
      hsl(hueAdj, satAdj, 0.14),
      hsl(hueAdj, satAdj, 0.12),
      hsl(hueAdj, satAdj, 0.1),
    ],
  };
  const shared = {
    highlight: hsl(hue, satAdj, 0.4),
    focus: {
      glow: transparentize(0.3, saturate(0.3, color)),
      border: color,
    },
  };

  const lightText = hsl(hue, 0.8, 0.1);
  const darkText = hsl(hue, 0.8, 0.9);

  let primary = {
    base: hsl(hue, satAdj, 0.6),
    hover: hsl(hue, satAdj, 0.7),
    active: hsl(hue, satAdj, 0.5),
  };
  primary.text = readableColor(primary.base, lightText, darkText);

  let button = {
    light: {
      bg: hsl(hue, 0.05, 0.7),
      hover: hsl(hue, 0.05, 0.8),
      active: hsl(hue, 0.05, 0.6),
    },
    dark: {
      bg: hsl(hue, 0.05, 0.2),
      hover: hsl(hue, 0.05, 0.3),
      active: hsl(hue, 0.05, 0.1),
    },
  };
  button.light.text = readableColor(button.light.bg, lightText, darkText);
  button.dark.text = readableColor(button.dark.bg, lightText, darkText);

  return {
    color: color,
    icon: "droplet",
    light: {
      ...themes.light,
      ...shared,
      name: `Light ${name || color}`,
      icon: "droplet",
      link: hsl(hue, 0.8, 0.35),
      color: hsl(hue, 0.8, 0.15),
      bg: hsl(hueAdj, 0.05, 0.8),
      primary,
      button: button.light,
      card: {
        ...themes.light.card,
        bg: levels.light[0],
        innerBg: levels.light[1],
        border: hsl(hue, satAdj * 0.62, 0.62),
        innerBorder: hsl(hue, satAdj * 0.38, 0.62),
      },
      header: {
        bg: hsl(hue, sat, lum * 0.8),
        // bg: color,
        border: hsl(hue, satAdj * 0.62, 0.75),
      },
    },
    dark: {
      ...themes.dark,
      ...shared,
      name: `Dark ${name || color}`,
      icon: "droplet",
      link: hsl(hue, 0.8, 0.85),
      color: hsl(hue, 0.8, 0.8),
      bg: hsl(hueAdj, 0.05, 0.1),
      button: button.dark,
      card: {
        ...themes.dark.card,
        bg: levels.dark[0],
        innerBg: levels.dark[1],
        border: hsl(hue, 0.5, 0.22),
        innerBorder: hsl(hue, 0.25, 0.22),
      },
      header: {
        // bg: hsl(hueAdj, 0.3, 0.2),
        bg: color,
        border: hsl(hue, satAdj / 2, 0.5),
      },
    },
  };
};

export default ({ color, name, simple }) =>
  new Promise((resolve) => resolve(genThemeSync({ color, name, simple })));
