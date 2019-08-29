import { colorGroups } from "./material-design-color-palette";

export default (color, dark) =>
  colorGroups[color]
    ? {
        highlight: colorGroups[color][500],
        link: colorGroups[color][dark ? 300 : 500],
        focus: {
          glow: colorGroups[color].A100,
          border: colorGroups[color][dark ? 300 : 500],
        },
        primary: {
          overlay: dark ? "#000" : "#fff",
          text: colorGroups[color][dark ? "A100" : "A400"],
          base: colorGroups[color][dark ? 300 : 500],
          hover: colorGroups[color][dark ? 200 : 400],
          active: colorGroups[color][dark ? 400 : 600],
        },
      }
    : {};
