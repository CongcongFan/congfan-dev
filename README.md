# congfan.dev

Static Cloudflare Pages site for Cong Fan, plus a small Cloudflare Worker for project brief submissions.

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
- Brief API Worker route: `congfan.dev/api/brief*`

The brief Worker also needs a `BRIEF_RECIPIENT` Worker secret set to a verified Cloudflare Email Routing destination address. The public site still shows `work@congfan.dev`; the private destination is not committed.

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
