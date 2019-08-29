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

const genTheme = ({ color, name, simple }) =>
  new Promise((resolve) => {
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

    const lightText = hsl(hue, 0.8, 0.1);
    const darkText = hsl(hue, 0.8, 0.9);

    let primary = {
      base: hsl(hue, saturation, 0.6),
      hover: hsl(hue, saturation, 0.7),
      active: hsl(hue, saturation, 0.5),
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

    const generatedThemes = {
      color: color,
      icon: "droplet",
      light: {
        ...themes.light,
        ...shared,
        name: `Light ${name || color}`,
        icon: "droplet",
        link: hsl(hue, 0.8, 0.35),
        color: hsl(hue, 0.8, 0.15),
        bg: hsl(hue + hueAdj, 0.05, 0.8),
        primary,
        button: button.light,
        card: {
          ...themes.light.card,
          bg: levels.light[0],
          innerBg: levels.light[1],
          border: hsl(hue, saturation * 0.62, 0.62),
          innerBorder: hsl(hue, saturation * 0.38, 0.62),
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
        icon: "droplet",
        link: hsl(hue, 0.8, 0.85),
        color: hsl(hue, 0.8, 0.8),
        bg: hsl(hue + hueAdj, 0.05, 0.1),
        button: button.dark,
        card: {
          ...themes.dark.card,
          bg: levels.dark[0],
          innerBg: levels.dark[1],
          border: hsl(hue, 0.5, 0.22),
          innerBorder: hsl(hue, 0.25, 0.22),
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
