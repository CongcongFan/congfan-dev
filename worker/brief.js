import { EmailMessage } from "cloudflare:email";

const CONTACT_EMAIL = "work@congfan.dev";
const MAX_FIELD_LENGTH = 4000;

const labels = {
  name: "Name",
  email: "Reply email",
  build: "What are you trying to build or fix?",
  problem: "What problem does it solve?",
  user: "Who is the user/customer?",
  existing: "Existing codebase, website, workflow, or prototype",
  tools: "Tools involved",
  budget: "Budget range",
  timeline: "Timeline",
  done: "Definition of done",
};

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    "Cache-Control": "no-store",
  },
});

const clean = (value) => String(value || "")
  .replace(/\0/g, "")
  .trim()
  .slice(0, MAX_FIELD_LENGTH);

const headerSafe = (value) => clean(value).replace(/[\r\n]/g, " ");

const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const safeUserId = (value) => clean(value)
  .replace(/[^a-zA-Z0-9_.:-]/g, "")
  .slice(0, 128);

async function readPayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function formatBrief(payload, request) {
  const rows = Object.entries(labels)
    .map(([key, label]) => [label, clean(payload[key])])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}\n${value}`);

  const meta = [
    `Submitted: ${new Date().toISOString()}`,
    `Source: ${request.headers.get("referer") || "direct"}`,
    `IP country: ${request.cf?.country || "unknown"}`,
  ];

  return [
    "New project brief from congfan.dev",
    "",
    ...rows,
    "",
    "Submission metadata",
    ...meta,
  ].join("\n\n");
}

function createMessage(payload, request) {
  const from = CONTACT_EMAIL;
  const to = headerSafe(payload.recipient) || CONTACT_EMAIL;
  const replyTo = headerSafe(payload.email);
  const name = headerSafe(payload.name) || "Website visitor";
  const subject = `Project brief: ${headerSafe(payload.build).slice(0, 80) || name}`;
  const body = formatBrief(payload, request);
  const messageId = `<brief-${crypto.randomUUID()}@congfan.dev>`;

  const raw = [
    `From: Cong Fan Website <${from}>`,
    `To: ${to}`,
    `Reply-To: ${name} <${replyTo}>`,
    `Subject: ${subject}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");

  return new EmailMessage(from, to, raw);
}

async function createChatkitSession(request, env) {
  if (!env.OPENAI_API_KEY || !env.CHATKIT_WORKFLOW_ID) {
    return json({ ok: false, error: "Brief assistant is not configured yet." }, 503);
  }

  let payload = {};
  try {
    payload = await readPayload(request);
  } catch {
    return json({ ok: false, error: "Could not start Chat With Me." }, 400);
  }

  const user = safeUserId(payload.user) || `visitor-${crypto.randomUUID()}`;
  const workflow = { id: env.CHATKIT_WORKFLOW_ID };
  if (env.CHATKIT_WORKFLOW_VERSION) {
    workflow.version = env.CHATKIT_WORKFLOW_VERSION;
  }

  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      workflow,
      user,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.client_secret) {
    console.error("ChatKit session failed", response.status, result?.error?.message || "unknown");
    return json({ ok: false, error: "Brief assistant could not start right now." }, 502);
  }

  return json({ client_secret: result.client_secret });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (url.pathname === "/api/chatkit/session" && request.method === "POST") {
      return createChatkitSession(request, env);
    }

    if (url.pathname !== "/api/brief" || request.method !== "POST") {
      return json({ ok: false, error: "Not found." }, 404);
    }

    let payload;
    try {
      payload = await readPayload(request);
    } catch {
      return json({ ok: false, error: "Could not read the brief." }, 400);
    }

    if (clean(payload.company_url)) {
      return json({ ok: true });
    }

    const email = clean(payload.email);
    const build = clean(payload.build);

    if (!looksLikeEmail(email)) {
      return json({ ok: false, error: "Please include a valid reply email." }, 400);
    }

    if (build.length < 10) {
      return json({ ok: false, error: "Please describe what you are trying to build or fix." }, 400);
    }

    if (!env.BRIEF_EMAIL) {
      return json({ ok: false, error: "Brief email service is not configured yet." }, 503);
    }

    try {
      await env.BRIEF_EMAIL.send(createMessage({
        ...payload,
        email,
        build,
        recipient: env.BRIEF_RECIPIENT,
      }, request));
    } catch (error) {
      console.error("Brief email send failed", error?.message || error);
      return json({ ok: false, error: "Brief email could not be sent right now." }, 502);
    }

    return json({ ok: true });
  },
};
