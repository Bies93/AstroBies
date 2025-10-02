# AstroBies - Game Development Project

## Overview

AstroBies is a modern arcade shooter built with TypeScript and Vite, refactored to a modular ECS architecture. The legacy monolithic version is preserved under `legacy/`.

## Tech Stack
- TypeScript, Vite
- ECS: bitecs
- Rendering: Canvas 2D (optional PIXI)
- Audio: Howler
- Testing: Vitest (happy-dom)
- Linting/Formatting: ESLint + Prettier

## Project Structure
```
src/
  core/          # Game loop, input, audio, assets
  ecs/           # Components, systems, world management
  render/        # Canvas2D renderer (optional PIXI API)
  ui/            # HUD and simple views
  assets/        # Sprites, sounds, fonts
  config.ts      # Constants and tunables
  main.ts        # Entry point
legacy/
  index.html     # Frozen legacy version (pre-refactor)
```

## Setup
On Windows without admin rights, use the provided wrapper:

```
setup_env.bat npm install
setup_env.bat npm run dev
setup_env.bat npm run build
setup_env.bat npm run test
setup_env.bat npm run lint
```

## Architecture

### ECS
- Components: Position, Velocity, Health, Size, Render, Lifetime, Damage; Tags: Player, Enemy, Bullet
- Systems: playerControl → movement → spawn → shooting → lifetime → collision → damage/despawn → score/level → render

### Game Loop
- Fixed timestep updates (120 Hz)
- Separate render tick and DPR scaling
- No DOM in systems; UI updates via HUD wrapper

### Rendering
- Canvas2D batch-style drawing in `renderer2d.ts`
- Optional PIXI renderer stub with matching API

### Audio
- Howler wiring in `core/audio.ts`
- Unlock on first interaction; volume/mute planned in HUD

## Controls
- Move: WASD or Arrow keys
- Shoot: Hold mouse/touch or press Space

## Deployment
- `vite.config.ts` uses `base: '/AstroBies/'` for GitHub Pages
- `npm run build` outputs `dist/`

## Legacy
- The original page with inline logic was copied to `legacy/index.html`.

