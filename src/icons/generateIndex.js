const fs = require("fs");

const folder = fs.readdirSync("src/icons");
let mapLines = ["const icons = {"];

const importLines = folder.map((file) => {
  if (!file.endsWith(".svg")) return `/* Skipping ${file}: not an SVG */`;
  const component = file
    .replace(".svg", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  mapLines.push(`  ${component.toLowerCase()}: <${component} />,`);
  return `import { ReactComponent as ${component} } from "./${file}";`;
});
mapLines.push("};");

const content = [
  `import React from "react";`,
  "",
  ...importLines,
  "",
  ...mapLines,
  "",
  "export default icons;",
].join("\n");

fs.writeFile("src/icons/index.js", content, (error) => {
  if (error) throw error;
  else console.log("Index generated successfully.");
});
