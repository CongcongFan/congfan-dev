import { access, readFile } from "node:fs/promises";

for (const file of [
  "index.html",
  "hero-operator.png",
  "agentic-workflow-loop.mp4",
  "robots.txt",
  "sitemap.xml",
  "_headers",
]) {
  await access(file);
}

const sitemap = await readFile("sitemap.xml", "utf8");
if (!sitemap.includes("https://congfan.dev/")) {
  console.error("sitemap.xml does not include canonical production URL");
  process.exit(1);
}

console.log("test ok");
