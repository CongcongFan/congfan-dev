import { access, cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const file of [
  "index.html",
  "hero-operator.png",
  "cong-fan-headshot.jpg",
  "agentic-workflow-loop.mp4",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "_headers",
  "favicon.svg",
  "favicon-32.png",
  "favicon-192.png",
  "favicon-512.png",
  "apple-touch-icon.png",
  "site.webmanifest",
]) {
  await cp(file, `dist/${file}`);
}

try {
  await access("field-notes");
  await cp("field-notes", "dist/field-notes", { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
