import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
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

const missing = [];
for (const needle of [
  '<link rel="canonical" href="https://congfan.dev/"',
  'property="og:url" content="https://congfan.dev/"',
  "mailto:work@congfan.dev",
  "https://github.com/CongcongFan",
]) {
  if (!html.includes(needle)) missing.push(needle);
}

const leaked = forbidden.filter((needle) => html.toLowerCase().includes(needle.toLowerCase()));

if (missing.length || leaked.length) {
  if (missing.length) console.error("Missing required production strings:", missing.join(", "));
  if (leaked.length) console.error("Forbidden strings found:", leaked.join(", "));
  process.exit(1);
}

console.log("lint ok");
