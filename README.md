# congfan.dev

Static Cloudflare Pages site for Cong Fan.

## Current deployment

- GitHub repo: <https://github.com/CongcongFan/congfan-dev>
- Cloudflare Pages project: `congfan-dev`
- Pages URL: <https://congfan-dev.pages.dev>
- Latest deployment: <https://2e9acae4.congfan-dev.pages.dev>
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
