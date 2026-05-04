import { access, readFile } from "node:fs/promises";

for (const file of [
  "index.html",
  "hero-operator.png",
  "cong-fan-headshot.jpg",
  "agentic-workflow-loop.mp4",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "_headers",
  "worker/brief.js",
  "wrangler.brief.toml",
  "field-notes/agentic-coding-loop.html",
  "field-notes/ai-workflow-fit-check.html",
  "field-notes/repo-problem-product-problem.html",
  "field-notes/keep-ai-builds-small.html",
]) {
  await access(file);
}

const sitemap = await readFile("sitemap.xml", "utf8");
for (const url of [
  "https://congfan.dev/",
  "https://congfan.dev/field-notes/agentic-coding-loop",
  "https://congfan.dev/field-notes/ai-workflow-fit-check",
  "https://congfan.dev/field-notes/repo-problem-product-problem",
  "https://congfan.dev/field-notes/keep-ai-builds-small",
]) {
  if (!sitemap.includes(url)) {
    console.error(`sitemap.xml does not include ${url}`);
    process.exit(1);
  }
}

if (!sitemap.includes("https://congfan.dev/")) {
  console.error("sitemap.xml does not include canonical production URL");
  process.exit(1);
}

console.log("test ok");
