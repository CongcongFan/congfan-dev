# congfan.dev

Static Cloudflare Pages site for Cong Fan, plus a small Cloudflare Worker for project brief submissions and the Chat With Me session endpoint.

## Current deployment

- GitHub repo: <https://github.com/CongcongFan/congfan-dev>
- Cloudflare Pages project: `congfan-dev`
- Pages URL: <https://congfan-dev.pages.dev>
- Custom domains added in Pages:
  - `congfan.dev` active, SSL enabled
  - `www.congfan.dev` active, SSL enabled
- Redirect Rule:
  - `https://www.congfan.dev/*` -> `https://congfan.dev/${1}` with 301
  - query string preserved

## Cloudflare Pages settings

- Project name: `congfan-dev`
- Production branch: `main`
- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `20`

## Local commands

```bash
npm install
npm run build
npm run lint
npm run test
npm run deploy:all
```

SEO/GEO state and external monitoring notes live in `SEO_GEO.md`.

## Direct Wrangler deploy

Do not commit Cloudflare tokens. Use one of:

```bash
npx wrangler login
npm run deploy
npm run deploy:brief
```

or:

```bash
CLOUDFLARE_API_TOKEN=... npm run deploy
```

## GitHub Actions deploy

The existing Cloudflare Pages project was created as a Direct Uploads project, so Cloudflare API does not allow converting it in place to a Git-connected `source` project.

Automatic deploys are prepared with `.github/workflows/deploy.yml`. Before relying on push-to-main deploys, add these GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` with Cloudflare Pages write access
- `CLOUDFLARE_ACCOUNT_ID` for the account that owns `congfan-dev`

The workflow deploys both:

- Cloudflare Pages project: `congfan-dev`
- Brief API Worker routes:
  - `congfan.dev/api/brief*`
  - `congfan.dev/api/chatkit*`

The brief Worker also needs a `BRIEF_RECIPIENT` Worker secret set to a verified Cloudflare Email Routing destination address. The public site still shows `work@congfan.dev`; the private destination is not committed.

## ChatKit widget

The homepage includes a floating ChatKit widget for pre-brief triage. It is not a standalone page section; it opens from the contact card and the fixed `Chat With Me` launcher.

The agent should answer normal greetings and early questions in plain conversational text. It should not use Markdown tables for greetings, simple service questions, or early exploration. The `Project Brief Draft` widget should only appear when the visitor has enough project context or explicitly asks to turn the conversation into a form-ready brief.

Required Worker secrets:

- `OPENAI_API_KEY`
- `CHATKIT_WORKFLOW_ID` (`wf_69f82ebbf5e081909562e52c2b2072dd0c91791af05d8467`)

Required Worker vars:

- `CHATKIT_WORKFLOW_VERSION` (`8`)

Set them with Wrangler when the Agent Builder workflow is published:

```bash
npx wrangler secret put OPENAI_API_KEY --config wrangler.brief.toml
npx wrangler secret put CHATKIT_WORKFLOW_ID --config wrangler.brief.toml
npm run deploy:brief
```

Current Agent Builder setup:

- Workflow: `congfan.dev Brief Assistant`
- Version: `8`
- Output widget: `Project Brief Draft`
- Allowed ChatKit domains: `congfan.dev`, `www.congfan.dev`
- Domain public key: `domain_pk_69f83c0f78c48190b8658985675c57040d92416c607fe90f`
- File Search Vector Store: `congfan_dev_public_knowledge` (`vs_69f85885265481918c882b4f22fef640`)
- Latest uploaded public bundle file: `knowledge/congfan-dev-public-knowledge.md` (`file-XimkxGbZrjZr7q3vF937T6`)
- Workflow topology: `Start -> Brief Assistant`
- Session endpoint pins `CHATKIT_WORKFLOW_VERSION=8` so ChatKit does not reuse an older published workflow snapshot.
- The frontend reuses an existing ChatKit client secret for the active session. It only asks the Worker for a new session when ChatKit has no current client secret.
- The frontend visitor key is `congfan_chatkit_visitor_v8` to avoid reusing earlier ChatKit thread history from pre-knowledge-base workflow versions.

The Agent Builder workflow setup lives in `agentkit/brief-assistant-workflow.md`. It contains the workflow name, agent instructions, starter prompts, test conversations, and widget action contract.

### Public knowledge for ChatKit

The recommended runtime is:

```txt
ChatKit widget -> Agent Builder workflow -> File Search vector store -> Brief Assistant
```

Use `knowledge/*.md` as the reviewed public-safe knowledge source. Do not upload raw ChatGPT memory, raw Codex memory, local Skills, local paths, secrets, private repo notes, or unreviewed personal notes to the public assistant.

Prepare or upload the knowledge files with:

```bash
npm run knowledge:upload -- --dry-run
OPENAI_API_KEY=... npm run knowledge:upload
```

The production Vector Store is `congfan_dev_public_knowledge` (`vs_69f85885265481918c882b4f22fef640`). It is attached to the primary `Brief Assistant` agent as a File Search tool. The upload command prints the Vector Store ID if a new store is created; attach that Vector Store to the Agent Builder File Search tool/node or agent tool, then publish the workflow after preview testing.

The current local distilled source is `memory/distilled/codex/site-assistant-instructions.md`, which is ignored by git until explicitly reviewed for publication. If the workflow returns a ChatKit widget action that should copy a draft into the site form, use one of these client-handled action names:

- `use_project_brief`
- `fill_project_brief`
- `send_to_brief_form`

Expected action payload keys:

- `build`
- `problem`
- `user`
- `existing`
- `tools`
- `budget`
- `timeline`
- `done`

Do not commit OpenAI keys, Cloudflare tokens, private raw memories, or unreviewed personal notes.

## Custom domains

Add both custom domains in Cloudflare Pages:

- `congfan.dev`
- `www.congfan.dev`

The canonical URL is `https://congfan.dev/`.

Cloudflare Pages `_redirects` does not handle domain-level redirects. The live zone uses a Redirect Rule to send `www.congfan.dev` to `https://congfan.dev`.

If DNS records are not created automatically, add:

```txt
Type: CNAME
Name: @
Target: congfan-dev.pages.dev
Proxy: Proxied

Type: CNAME
Name: www
Target: congfan-dev.pages.dev
Proxy: Proxied
```
