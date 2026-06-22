# SPEC 02 — Home page y actualización de Nav

> **Estado:** Aprobado · **Depende de:** SPEC 01 · **Fecha:** 2026-06-21
> **Objetivo:** Implementar la landing Home page en `/`, mover la Biblioteca actual a `/games`, y actualizar el Nav para reflejar la nueva estructura de rutas.

---

## Scope

**Incluido:**

- Nueva ruta `/` → `app/page.tsx` con el contenido de `references/templates/home-about/home.jsx`:
  - Hero con `FloatingSilhouettes`, eyebrow, título en 3 líneas, subtítulo y 2 CTAs
  - Sección "¿Por qué Arcade Vault?" con `FeatureGrid` (4 cards con íconos pixel SVG)
  - Sección "Juegos disponibles ahora" con rail de 6 `MiniCard` y botón "Ver todos"
  - Sección `HomeStats` (3 bloques: juegos, partidas, ranking)
  - Sección "Actividad en vivo" con ticker de últimas puntuaciones y top 5 jugadores del día (datos mock estáticos)
  - Sección "Precios" con price card + FAQ
  - Sección final CTA
  - Hook `useReveal` (IntersectionObserver para animaciones scroll)
- Biblioteca actual (`app/page.tsx`) movida a `app/games/page.tsx`
- Ruta `/games` se convierte en la Biblioteca; `/games/[id]` y `/games/[id]/play` sin cambios
- `app/components/Nav.tsx` actualizado: añadir link "Inicio" → `/`, "Biblioteca" → `/games`, corregir estados activos
- CSS home-specific (`.home`, `.home-hero`, `.home-silos`, `.feature-grid`, `.mini-rail`, `.home-stats`, `.activity-grid`, `.pricing-grid`, `.home-final`, `.reveal`) portado a `app/globals.css`

**Fuera de scope (para specs futuros):**

- Ruta `/about` (no se implementa en este spec aunque el Nav de la plantilla la incluye)
- Link "Acerca de" en el Nav (se añade cuando exista la ruta)
- Actividad en vivo conectada a datos reales (`av_scores` de localStorage)
- Animación de contador numérico en los stats

---

## Modelo de datos

Este spec no introduce estructuras de datos nuevas. Reutiliza los tipos y constantes de SPEC 01:

- `GAMES: Game[]` — usado en `MiniCard` rail (`GAMES.slice(0, 6)`)
- `AVUser` / `av_user` en localStorage — leído por Nav vía `SessionContext` (sin cambios)

Los datos de actividad (ticker y top players) son arrays literales hardcodeados directamente
en el componente `HomePage`, igual que en la plantilla de referencia.

---

## Plan de implementación

1. **Mover Biblioteca a `/games`** — renombrar `app/page.tsx` a `app/games/page.tsx`.
   Sistema funcional: Biblioteca accesible en `/games`; `/` devuelve 404 temporalmente.

2. **Portar CSS home-specific a `app/globals.css`** — añadir los bloques `.home`, `.home-hero`,
   `.home-silos`, `.home-title`, `.home-sub`, `.home-ctas`, `.hero-scroll`, `.home-section`,
   `.section-head`, `.kicker`, `.section-rule`, `.feature-grid`, `.feature-card`, `.ft-icon`,
   `.mini-rail`, `.mini-card`, `.mini-cover`, `.mini-meta`, `.home-stats`, `.stats-inner`,
   `.stat-block`, `.activity-grid`, `.activity-card`, `.ac-head`, `.ticker`, `.tick-row`,
   `.top-list`, `.top-row`, `.pricing-grid`, `.price-card`, `.pricing-faq`, `.faq-item`,
   `.home-final`, `.reveal` desde `references/templates/home-about/styles.css`.
   Sistema funcional: clases disponibles antes de montar el componente.

3. **Crear `app/page.tsx` — componente `HomePage`** — portar `home.jsx` a TSX con Next.js:
   - `useReveal` como hook local (IntersectionObserver)
   - `FloatingSilhouettes` como subcomponente local
   - `FeatureIcon` como subcomponente local
   - `MiniCard` como subcomponente local; `onClick` usa `router.push('/games/' + game.id)`
   - CTAs: "EXPLORAR JUEGOS" → `router.push('/games')`, "CREAR CUENTA" → `router.push('/auth')`
   - "VER SALÓN →" → `router.push('/hall-of-fame')`
   - Datos de actividad como arrays literales en el componente
   Sistema funcional: `/` muestra la Home completa.

4. **Actualizar `app/components/Nav.tsx`** — añadir link "Inicio" → `/` y cambiar
   "Biblioteca" → `/games`; actualizar `isHome` (`pathname === '/'`),
   `isLibrary` (`pathname.startsWith('/games')`); aplicar mismo cambio en el panel mobile.
   Sistema funcional: navegación coherente entre todas las rutas.

---

## Criterios de aceptación

- [ ] `/` carga el Home page sin errores en consola
- [ ] El hero muestra el eyebrow, título en 3 líneas, subtítulo y 2 botones CTA
- [ ] Los 8 silhouettes SVG flotan con animación en el hero
- [ ] "EXPLORAR JUEGOS" navega a `/games`
- [ ] "CREAR CUENTA" navega a `/auth`
- [ ] La sección "¿Por qué Arcade Vault?" muestra 4 feature cards con íconos pixel SVG
- [ ] La sección de juegos muestra un rail con 6 MiniCards; click en una navega a `/games/[id]`
- [ ] "VER TODOS LOS JUEGOS →" navega a `/games`
- [ ] La sección de stats muestra los 3 bloques (12+, MILES, GLOBAL)
- [ ] La sección de actividad muestra el ticker de 7 filas y el top 5 de jugadores
- [ ] "VER SALÓN →" navega a `/hall-of-fame`
- [ ] La sección de precios muestra el price card y los 3 FAQ
- [ ] "EMPEZAR GRATIS →" e "INSERTAR MONEDA →" navegan a `/auth` y `/games` respectivamente
- [ ] Las secciones con clase `.reveal` aparecen con animación al hacer scroll
- [ ] `/games` muestra la Biblioteca (hero, búsqueda, filtros, grid de GameCards)
- [ ] `/games/[id]` y `/games/[id]/play` siguen funcionando sin cambios
- [ ] El Nav muestra "Inicio" (activo en `/`) y "Biblioteca" (activo en `/games` y subrutas)
- [ ] El link del logo navega a `/`
- [ ] El menú mobile incluye "Inicio" y "Biblioteca" con las URLs correctas
- [ ] `tsc --noEmit` pasa sin errores

---

## Decisiones tomadas y descartadas

- **Sí: `/games` como ruta de Biblioteca** — la Home ocupa `/` como punto de entrada principal.
  Descartado: `/library` (menos intuitivo) y mantener Biblioteca en `/` (la Home no tendría ruta canónica).

- **Sí: actividad en vivo con datos mock estáticos** — consistente con el enfoque MVP visual de SPEC 01.
  Descartado: leer `av_scores` de localStorage (agrega complejidad sin valor visual distinto en esta fase).

- **Sí: subcomponentes locales en `app/page.tsx`** — `FloatingSilhouettes`, `FeatureIcon` y `MiniCard`
  son exclusivos del Home; extraerlos a `components/` sería prematuro.
  Descartado: componentes globales reutilizables (no hay uso fuera del Home en este spec).

- **No: link "Acerca de" en el Nav** — la ruta `/about` no existe aún; añadir el link sin destino
  genera un 404. Se agrega cuando el About tenga su propio spec.

- **Sí: CSS portado a `globals.css`** — coherente con la arquitectura actual del proyecto.
  Descartado: CSS module por componente (rompería la convención establecida en SPEC 01).
