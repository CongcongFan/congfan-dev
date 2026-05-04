import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const file of [
  "index.html",
  "hero-operator.png",
  "cong-fan-headshot.jpg",
  "agentic-workflow-loop.mp4",
  "robots.txt",
  "sitemap.xml",
  "_headers",
]) {
  await cp(file, `dist/${file}`);
}
