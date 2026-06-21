# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

No test suite is configured yet.

## Stack

- **Next.js 16.2.9** — App Router only; Pages Router not used
- **React 19.2** — includes View Transitions, `useEffectEvent`
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`; theme tokens defined with `@theme inline`
- **TypeScript 5**

## Skills

Usa siempre /frontend-design para diseñar la interfaz de usuario.

## Next.js 16 Breaking Changes

This is **Next.js 16**, not 15 or 14. Key differences from prior versions:

**Async Request APIs** — `params` and `searchParams` in pages/layouts are now `Promise`s and must be awaited. Synchronous access was removed.

```tsx
// v16 — params is a Promise
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**`middleware` → `proxy`** — The `middleware.ts` convention and `middleware` export name are deprecated. Use `proxy.ts` with `export function proxy(request: Request)`. Edge runtime is NOT supported in `proxy`; use `middleware` only if you need Edge.

**`revalidateTag` requires a second argument** — the `cacheLife` profile. Single-argument form is deprecated.

**Caching** — `experimental.dynamicIO` and `experimental.useCache` are removed. Use `cacheComponents: true` in `next.config.ts` to enable `'use cache'` directive, `cacheTag`, `cacheLife`. This also enables PPR as default behavior.

**PPR** — `experimental.ppr` flag and `experimental_ppr` route segment config are removed. Enable via `cacheComponents`.

**ESLint** — uses flat config (`eslint.config.mjs`), not `.eslintrc`. Run via `eslint` CLI directly, not `next lint`.

**Scroll behavior** — Next.js no longer overrides `scroll-behavior: smooth`. Add `data-scroll-behavior="smooth"` to `<html>` if you want the old behavior.

## New APIs in v16

- `'use cache'` directive — marks a component, function, or file as cacheable (requires `cacheComponents: true`)
- `cacheTag` / `cacheLife` — stable (no `unstable_` prefix needed)
- `updateTag` — Server Actions only; read-your-writes cache invalidation
- `refresh` — Server Actions only; refreshes the client router
- `unstable_instant` route export — validates instant navigation (static shell) at dev/build time
- `proxy.ts` file convention — replaces `middleware.ts`

## Docs

Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Key paths:
- `01-app/02-guides/upgrading/version-16.md` — breaking changes from v15
- `01-app/03-api-reference/01-directives/use-cache.md`
- `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- `01-app/02-guides/instant-navigation.md` — required reading before touching Suspense boundaries or navigation
