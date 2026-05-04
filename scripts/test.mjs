import { access, readFile } from "node:fs/promises";

for (const file of [
  "index.html",
  "hero-operator.png",
  "cong-fan-headshot.jpg",
  "agentic-workflow-loop.mp4",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "worker/brief.js",
  "wrangler.brief.toml",
  "field-notes/agentic-coding-loop.html",
]) {
  await access(file);
}

const sitemap = await readFile("sitemap.xml", "utf8");
if (!sitemap.includes("https://congfan.dev/") || !sitemap.includes("https://congfan.dev/field-notes/agentic-coding-loop")) {
  console.error("sitemap.xml does not include canonical production URL");
  process.exit(1);
}

console.log("test ok");
