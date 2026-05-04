import { access, readFile } from "node:fs/promises";

for (const file of [
  "index.html",
  "hero-operator.png",
  "cong-fan-headshot.jpg",
  "agentic-workflow-loop.mp4",
  "favicon.svg",
  "favicon-32.png",
  "favicon-192.png",
  "favicon-512.png",
  "apple-touch-icon.png",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "SEO_GEO.md",
  "_headers",
  "agentkit/brief-assistant-workflow.md",
  "knowledge/congfan-positioning.md",
  "knowledge/services-pricing-fit.md",
  "knowledge/brief-assistant-rules.md",
  "knowledge/congfan-dev-public-knowledge.md",
  "knowledge/working-style.md",
  "knowledge/case-study-patterns.md",
  "knowledge/faq.md",
  "worker/brief.js",
  "wrangler.brief.toml",
  "scripts/upload-openai-knowledge.mjs",
  "field-notes/agentic-coding-loop.html",
  "field-notes/ai-workflow-fit-check.html",
  "field-notes/repo-problem-product-problem.html",
  "field-notes/keep-ai-builds-small.html",
]) {
  await access(file);
}

const sitemap = await readFile("sitemap.xml", "utf8");
const llms = await readFile("llms.txt", "utf8");
const seoGeo = await readFile("SEO_GEO.md", "utf8");
const index = await readFile("index.html", "utf8");
const worker = await readFile("worker/brief.js", "utf8");
const agentkit = await readFile("agentkit/brief-assistant-workflow.md", "utf8");
const uploadScript = await readFile("scripts/upload-openai-knowledge.mjs", "utf8");
const knowledgeFiles = [
  "knowledge/congfan-dev-public-knowledge.md",
  "knowledge/congfan-positioning.md",
  "knowledge/services-pricing-fit.md",
  "knowledge/brief-assistant-rules.md",
  "knowledge/working-style.md",
  "knowledge/case-study-patterns.md",
  "knowledge/faq.md",
];
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

if (!sitemap.includes("<lastmod>2026-05-04</lastmod>")) {
  console.error("sitemap.xml does not include homepage lastmod");
  process.exit(1);
}

for (const needle of [
  "https://cdn.platform.openai.com/deployments/chatkit/chatkit.js",
  "<openai-chatkit id=\"brief-chatkit\"></openai-chatkit>",
  "data-chatkit-open",
  "Chat With Me",
  "/api/chatkit/session",
  "widgets: {",
  "congfan_chatkit_visitor_v8",
  "if (currentClientSecret) return currentClientSecret",
  '<link rel="icon" href="/favicon.svg" type="image/svg+xml"',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png"',
  '<link rel="manifest" href="/site.webmanifest"',
  '<meta name="theme-color" content="#C0512F"',
  "Workflow Automation",
  "\"@type\": \"FAQPage\"",
  "\"@type\": \"OfferCatalog\"",
  "\"@type\": \"ItemList\"",
  "What AI workflow is a good fit?",
]) {
  if (!index.includes(needle)) {
    console.error(`index.html does not include ${needle}`);
    process.exit(1);
  }
}

for (const needle of [
  "Primary Topics",
  "AI workflow automation",
  "Common Questions",
  "Citation Guidance",
  "Chat With Me helps shape a brief",
]) {
  if (!llms.includes(needle)) {
    console.error(`llms.txt does not include ${needle}`);
    process.exit(1);
  }
}

for (const needle of [
  "Current Skill Matrix",
  "`keyword-research`",
  "`geo-content-optimizer`",
  "`technical-seo-checker`",
  "`memory-management`",
  "No project-level `MEMORY.md` exists",
]) {
  if (!seoGeo.includes(needle)) {
    console.error(`SEO_GEO.md does not include ${needle}`);
    process.exit(1);
  }
}

for (const file of [
  "index.html",
  "field-notes/agentic-coding-loop.html",
  "field-notes/ai-workflow-fit-check.html",
  "field-notes/repo-problem-product-problem.html",
  "field-notes/keep-ai-builds-small.html",
]) {
  const html = await readFile(file, "utf8");
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  if (!scripts.length) {
    console.error(`${file} does not include JSON-LD`);
    process.exit(1);
  }
  for (const [, json] of scripts) {
    try {
      JSON.parse(json);
    } catch (error) {
      console.error(`${file} has invalid JSON-LD: ${error.message}`);
      process.exit(1);
    }
  }
}

for (const file of [
  "field-notes/agentic-coding-loop.html",
  "field-notes/ai-workflow-fit-check.html",
  "field-notes/repo-problem-product-problem.html",
  "field-notes/keep-ai-builds-small.html",
]) {
  const html = await readFile(file, "utf8");
  for (const needle of [
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml"',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png"',
    "\"@type\": \"BreadcrumbList\"",
    "Related field notes",
    "/field-notes/",
  ]) {
    if (!html.includes(needle)) {
      console.error(`${file} does not include ${needle}`);
      process.exit(1);
    }
  }
}

const manifest = JSON.parse(await readFile("site.webmanifest", "utf8"));
for (const needle of ["Cong Fan", "/favicon-192.png", "/favicon-512.png", "#C0512F"]) {
  if (!JSON.stringify(manifest).includes(needle)) {
    console.error(`site.webmanifest does not include ${needle}`);
    process.exit(1);
  }
}

for (const needle of [
  "Project Brief Draft",
  "Default response mode: plain conversational text",
  "Do not use Markdown tables by default",
  "return a visible final answer",
  "Do not render the `Project Brief Draft` widget",
  "Recommended Knowledge Runtime",
  "File Search",
  "Published version: `8`",
  "Start -> Brief Assistant",
  "vs_69f85885265481918c882b4f22fef640",
  "file-XimkxGbZrjZr7q3vF937T6",
  "knowledge/congfan-positioning.md",
  "knowledge/congfan-dev-public-knowledge.md",
]) {
  if (!agentkit.includes(needle)) {
    console.error(`agentkit/brief-assistant-workflow.md does not include ${needle}`);
    process.exit(1);
  }
}

const publicKnowledge = await readFile("knowledge/congfan-dev-public-knowledge.md", "utf8");
for (const needle of [
  "Field Notes",
  "Common Public Questions",
  "agentic-coding-loop",
  "ai-workflow-fit-check",
  "Chat With Me vs project brief",
]) {
  if (!publicKnowledge.includes(needle)) {
    console.error(`knowledge/congfan-dev-public-knowledge.md does not include ${needle}`);
    process.exit(1);
  }
}

for (const needle of [
  "/vector_stores",
  "OPENAI_API_KEY",
  "knowledge/*.md",
  "--dry-run",
]) {
  if (!uploadScript.includes(needle)) {
    console.error(`scripts/upload-openai-knowledge.mjs does not include ${needle}`);
    process.exit(1);
  }
}

for (const file of knowledgeFiles) {
  const content = await readFile(file, "utf8");
  for (const forbidden of [
    "/Users/cong",
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID",
    "OPENAI_API_KEY",
    "fcc990206@gmail.com",
  ]) {
    if (content.includes(forbidden)) {
      console.error(`${file} contains forbidden private string: ${forbidden}`);
      process.exit(1);
    }
  }
}

for (const [file, content] of [
  ["SEO_GEO.md", seoGeo],
  ["llms.txt", llms],
]) {
  for (const forbidden of ["/Users/cong", "OPENAI_API_KEY", "CLOUDFLARE_API_TOKEN"]) {
    if (content.includes(forbidden)) {
      console.error(`${file} contains forbidden private string: ${forbidden}`);
      process.exit(1);
    }
  }
}

for (const needle of [
  "https://api.openai.com/v1/chatkit/sessions",
  "CHATKIT_WORKFLOW_ID",
  "CHATKIT_WORKFLOW_VERSION",
  "OpenAI-Beta",
  "/api/chatkit/session",
]) {
  if (!worker.includes(needle)) {
    console.error(`worker/brief.js does not include ${needle}`);
    process.exit(1);
  }
}

console.log("test ok");
