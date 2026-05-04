import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
const vectorStoreName = process.env.OPENAI_VECTOR_STORE_NAME || "congfan_dev_public_knowledge";
const existingVectorStoreId = process.env.OPENAI_VECTOR_STORE_ID || "";
const dryRun = process.argv.includes("--dry-run");

const knowledgeDir = path.resolve("knowledge");
const bundleFile = path.join(knowledgeDir, "congfan-dev-public-knowledge.md");
const forbidden = [
  "/Users/cong",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "OPENAI_API_KEY",
  "sk-live",
  "sk_live",
  "sk-test",
  "sk_test",
  "fcc990206@gmail.com",
];

async function openai(pathname, options = {}) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required unless you run with --dry-run.");
  }

  const response = await fetch(`https://api.openai.com/v1${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${pathname} failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
}

async function listKnowledgeFiles() {
  const entries = await readdir(knowledgeDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(knowledgeDir, entry.name))
    .sort();
  return files.includes(bundleFile) ? [bundleFile] : files;
}

async function readAndValidate(file) {
  const content = await readFile(file, "utf8");
  for (const needle of forbidden) {
    if (content.includes(needle)) {
      throw new Error(`${path.relative(process.cwd(), file)} contains forbidden private string: ${needle}`);
    }
  }
  return content;
}

const files = await listKnowledgeFiles();
if (!files.length) {
  throw new Error("No knowledge/*.md files found.");
}

const loaded = [];
for (const file of files) {
  const content = await readAndValidate(file);
  loaded.push({ file, content });
}

if (dryRun) {
  console.log(`dry run ok: ${loaded.length} knowledge files ready for vector store "${vectorStoreName}"`);
  for (const item of loaded) {
    console.log(`- ${path.relative(process.cwd(), item.file)} (${item.content.length} chars)`);
  }
  process.exit(0);
}

const vectorStore = existingVectorStoreId
  ? { id: existingVectorStoreId }
  : await openai("/vector_stores", {
      method: "POST",
      body: JSON.stringify({
        name: vectorStoreName,
        metadata: {
          site: "congfan.dev",
          source: "knowledge/*.md",
          visibility: "public-safe",
        },
      }),
    });

console.log(`Vector Store ID: ${vectorStore.id}`);

for (const item of loaded) {
  const filename = path.basename(item.file);
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", new Blob([item.content], { type: "text/markdown" }), filename);

  const uploadedFile = await openai("/files", {
    method: "POST",
    body: form,
  });

  await openai(`/vector_stores/${vectorStore.id}/files`, {
    method: "POST",
    body: JSON.stringify({ file_id: uploadedFile.id }),
  });

  console.log(`Uploaded ${filename}: ${uploadedFile.id}`);
}

console.log("Done. Add this vector store to the Agent Builder File Search tool/node.");
