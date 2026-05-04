# congfan.dev

Static Cloudflare Pages site for Cong Fan.

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
```

## Direct Wrangler deploy

Do not commit Cloudflare tokens. Use one of:

```bash
npx wrangler login
npm run deploy
```

or:

```bash
CLOUDFLARE_API_TOKEN=... npm run deploy
```

## Custom domains

Add both custom domains in Cloudflare Pages:

- `congfan.dev`
- `www.congfan.dev`

The canonical URL is `https://congfan.dev/`.

Cloudflare Pages `_redirects` does not handle domain-level redirects. Configure `www.congfan.dev` to redirect to `https://congfan.dev` with Cloudflare Bulk Redirects or a zone Redirect Rule after both custom domains are active.
