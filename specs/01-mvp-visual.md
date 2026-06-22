# 01-mvp-visual

**Estado:** Implementado
**Fecha:** 2026-06-21
**Dependencias:** ninguna (spec inicial)

**Objetivo:** Implementar las 5 pantallas visuales de Arcade Vault (Biblioteca, Detalle, Reproductor, Salón de la Fama, Auth) como rutas Next.js con UI funcional y datos mock, sin lógica de juego real.

---

## Alcance

### Incluido
- Ruta `/` → Biblioteca: hero, búsqueda, filtros por categoría, grid de GameCards con efecto tilt
- Ruta `/games/[id]` → Detalle: cover, info, stats, leaderboard mock, botones de acción
- Ruta `/games/[id]/play` → Reproductor: HUD con score en vivo (setInterval), botones Pausa/Fin/Salir, arena CRT con animaciones CSS de enemigos, modal "Fin del juego" con guardar puntaje en localStorage
- Ruta `/hall-of-fame` → Salón de la Fama: podio, tabla completa, highlight de usuario logueado
- Ruta `/auth` → Auth: tabs Login/Registro, formulario simulado, botones Google/GitHub con toast "Próximamente", opción "Jugar como invitado"
- Nav global: logo, links, contador de créditos, botón de sesión, menú hamburguesa mobile
- Footer global
- Tema visual completo (colores neón, tipografías pixel/mono, fondo con grid perspectiva + scanlines)
- Persistencia de usuario y scores en localStorage
- Data mock: 8 juegos, jugadores seed, función seededScores

### No incluido
- Lógica real de ningún juego
- Autenticación real (backend, OAuth real)
- Base de datos o API de scores
- Más pantallas más allá de las 5 listadas
- Tests

---

## Modelo de datos

### Tipos TypeScript

```ts
// Juego
interface Game {
  id: string
  title: string
  short: string
  long: string
  cat: 'ARCADE' | 'PUZZLE' | 'SHOOTER' | 'VERSUS'
  cover: string        // clase CSS para el cover-bg
  color: 'cyan' | 'magenta' | 'yellow' | 'green'
  best: number
  plays: string
}

// Usuario (sesión simulada)
interface AVUser {
  name: string         // máx 10 chars, uppercase
}

// Entrada de score
interface ScoreEntry {
  game: string         // Game.id
  score: number
  name: string
  at: number           // Date.now()
}

// Fila de leaderboard (generada por seededScores)
interface LeaderboardRow {
  rank: number
  name: string
  score: number
  date: string         // "DD/MM/YYYY"
}
```

### localStorage
| Clave       | Tipo              | Descripción                     |
|-------------|-------------------|---------------------------------|
| `av_user`   | `AVUser \| null`  | Sesión activa                   |
| `av_scores` | `ScoreEntry[]`    | Scores guardados por el usuario |

### Constantes globales (`lib/data.ts`)
- `GAMES: Game[]` — 8 juegos mock
- `CATS: string[]` — ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
- `seededScores(seed, count): LeaderboardRow[]` — generador determinista

---

## Plan de implementación

1. **Crear `lib/data.ts`** — exportar `GAMES`, `CATS`, `seededScores` y todos los tipos TypeScript.
   Sistema funcional: datos disponibles para el resto de la app.

2. **Configurar tema global (`app/globals.css`)** — portar variables CSS, tipografías (Press Start 2P, JetBrains Mono vía Google Fonts), fondo con grid perspectiva + scanlines + viñeta, clases utilitarias (`.neon-cyan`, `.neon-magenta`, `.pixel`, `.mono`, `.btn`, `.blink`, `.flicker`, `.fade-in`, `.cover-bg` y variantes de cover por juego).
   Sistema funcional: tema visual disponible globalmente.

3. **Crear `app/layout.tsx`** — incluir `<Nav>` y `<Footer>` globales, leer/escribir `av_user` en localStorage mediante un Context (`SessionContext`) que envuelva la app.
   Sistema funcional: navegación y sesión accesibles en todas las rutas.

4. **Crear `app/page.tsx` (Biblioteca)** — hero con efecto flicker, barra de búsqueda, chips de categoría, grid de `<GameCard>` con efecto tilt 3D en hover.
   Sistema funcional: pantalla principal navegable.

5. **Crear `app/games/[id]/page.tsx` (Detalle)** — cover, tags, título, descripción, stat-strip, botones "Jugar ahora" / "Volver", leaderboard lateral generado con `seededScores`.
   Sistema funcional: se puede navegar desde la Biblioteca y desde el Reproductor.

6. **Crear `app/games/[id]/play/page.tsx` (Reproductor)** — HUD (jugador, score, vidas, nivel), arena CRT con animaciones CSS de enemigos, botones Pausa/Fin/Salir, `setInterval` para score en vivo, modal "Fin del juego" con input de nombre + guardar en `av_scores` en localStorage.
   Sistema funcional: flujo completo desde Detalle → jugar → guardar score → volver.

7. **Crear `app/hall-of-fame/page.tsx` (Salón de la Fama)** — tabs por juego, podio top 3, tabla completa con `seededScores`, highlight de fila del usuario logueado si existe en localStorage.
   Sistema funcional: pantalla accesible desde Nav.

8. **Crear `app/auth/page.tsx` (Auth)** — tabs Login/Registro, formulario simulado (cualquier credencial acepta), "Jugar como invitado", botones Google/GitHub con toast "Próximamente". Al autenticar: guardar `av_user` en localStorage y redirigir a `/`.
   Sistema funcional: flujo completo de sesión simulada.

9. **Ajustes responsive y polish** — menú hamburguesa mobile en Nav, verificar breakpoints en grid de Biblioteca, Detalle y tabla del Salón.
   Sistema funcional: app usable en mobile.

---

## Criterios de aceptación

- [x] `/` muestra el hero, la barra de búsqueda filtra por nombre en tiempo real, los chips filtran por categoría, las GameCards tienen efecto tilt en hover
- [x] Hacer click en una GameCard navega a `/games/[id]`
- [x] `/games/[id]` muestra cover, tags, stats, descripción larga y leaderboard mock lateral
- [x] El botón "Jugar ahora" navega a `/games/[id]/play`
- [x] `/games/[id]/play` muestra HUD con score que sube automáticamente vía setInterval
- [x] El botón Pausa detiene el score y muestra overlay "EN PAUSA"; Reanudar lo retoma
- [x] El botón Fin abre el modal "Fin del juego" con la puntuación final
- [x] Guardar puntuación escribe en `av_scores` localStorage y muestra confirmación
- [x] `/hall-of-fame` muestra podio top 3 y tabla de 12 filas; los tabs cambian el juego activo
- [x] Si hay usuario en sesión, su fila aparece destacada en amarillo al final de la tabla
- [x] `/auth` alterna entre tabs Login y Registro; el campo de email solo aparece en Registro
- [x] Cualquier credencial en Login/Registro guarda el usuario en localStorage y redirige a `/`
- [x] "Jugar como invitado" limpia la sesión y redirige a `/`
- [x] Los botones Google y GitHub muestran un toast "Próximamente"
- [x] El Nav muestra el nombre del usuario cuando hay sesión activa; al hacer click cierra sesión
- [x] El menú hamburguesa funciona en mobile (< 768 px)
- [x] La app no tiene errores de TypeScript (`tsc --noEmit` pasa)

---

## Decisiones tomadas y descartadas

- **Rutas reales en lugar de hash-routing (SPA):** la plantilla usa `location.hash` para navegar. Se optó por rutas Next.js App Router (`/`, `/games/[id]`, etc.) para aprovechar el framework y permitir que la app crezca. Descartado: replicar el SPA de un solo `page.tsx`.

- **Reproductor con UI funcional (score en vivo, pausa, modal):** se mantiene el comportamiento de la plantilla (setInterval, estado de vidas/nivel). Descartado: shell estático sin lógica, ya que la pantalla sería inútil visualmente.

- **Auth simulada, sin backend:** cualquier credencial es aceptada; sesión guardada en localStorage. Botones Google/GitHub muestran toast "Próximamente". Descartado: integrar NextAuth u OAuth real (fuera de scope del MVP visual).

- **Persistencia en localStorage:** consistente con la plantilla y suficiente para un MVP. Descartado: sin persistencia (se perdería la sesión al refrescar, empeora la demo).

- **`SessionContext` en layout:** centraliza lectura/escritura de `av_user` para que Nav, Auth y Reproductor compartan el estado sin prop drilling. Descartado: leer localStorage directamente en cada componente (duplicación y desincronización).

- **Definición rápida sin ronda extra de preguntas:** el usuario respondió las 4 preguntas de clarificación en un solo bloque. No hubo ambigüedades pendientes.
