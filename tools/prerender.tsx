import { readFileSync, writeFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";

const html = readFileSync("dist/index.html", "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("Missing page insertion point");
writeFileSync(
  "dist/index.html",
  html.replace(marker, `<div id="root">${renderToString(<App />)}</div>`),
);
console.log("Prerendered Stillform for immediate first paint and static reading.");
