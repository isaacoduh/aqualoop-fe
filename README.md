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
pnpm lint
pnpm typecheck
pnpm build
```

## Netlify deployment

Connect this repository to Netlify. The included `netlify.toml` configures the
production build command, `.next` publish directory, and Node.js version.
Netlify detects Next.js and supplies its maintained OpenNext adapter
automatically.
