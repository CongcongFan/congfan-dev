import { readdir, readFile } from "node:fs/promises";

const forbidden = [
  "hello@example.com",
  "fcc990206@gmail.com",
  "api_token",
  "api-token",
  "cloudflare_api_token",
  "CLOUDFLARE_API_TOKEN",
  "sk_live_",
  "sk_test_",
];

async function htmlFiles(dir = ".") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "dist" || entry.name === "node_modules" || entry.name === ".git") continue;
    const path = `${dir === "." ? "" : `${dir}/`}${entry.name}`;
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const files = await htmlFiles();
const htmlByFile = await Promise.all(files.map(async (file) => [file, await readFile(file, "utf8")]));

const missing = [];
const index = htmlByFile.find(([file]) => file === "index.html")?.[1] ?? "";
for (const needle of [
  '<link rel="canonical" href="https://congfan.dev/"',
  'property="og:url" content="https://congfan.dev/"',
  "mailto:work@congfan.dev",
  "https://github.com/CongcongFan",
  'action="/api/brief"',
]) {
  if (!index.includes(needle)) missing.push(needle);
}

const leaked = [];
for (const [file, html] of htmlByFile) {
  for (const needle of forbidden) {
    if (html.toLowerCase().includes(needle.toLowerCase())) leaked.push(`${needle} in ${file}`);
  }
}

if (missing.length || leaked.length) {
  if (missing.length) console.error("Missing required production strings:", missing.join(", "));
  if (leaked.length) console.error("Forbidden strings found:", leaked.join(", "));
  process.exit(1);
}

console.log("lint ok");
