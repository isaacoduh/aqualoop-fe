# AquaLoop

Frontend for AquaLoop, a water-refill and reusable-bottle exchange marketplace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- TanStack Query
- Netlify

## Local development

Use Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
pnpm release:check
```

This runs lint, TypeScript validation, and the optimized production build in
the same order used for release QA.

## Netlify deployment

Connect this repository to Netlify. The included `netlify.toml` configures the
production build command, `.next` publish directory, and Node.js version.
Netlify detects Next.js and supplies its maintained OpenNext adapter
automatically.

To reproduce the Netlify deploy-preview build context locally with the latest
CLI, run:

```bash
pnpm dlx netlify-cli build --context deploy-preview
```

Opening a pull request on the connected repository creates the shareable
Deploy Preview. Use `netlify deploy` only when you intentionally want a manual
draft deploy.
