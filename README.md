# Neon Defender - Game Development Project

## Overview

A modern space shooter game built with TypeScript, Vite, and ECS architecture. This project follows a modular, scalable architecture using Entity-Component-System (ECS) pattern for optimal performance and maintainability.

## Tech Stack

- **Language**: TypeScript
- **Build Tool**: Vite
- **Architecture**: Entity-Component-System (ECS) using bitecs
- **Rendering**: Canvas 2D or PIXI.js
- **Audio**: Howler.js
- **Testing**: Vitest with happy-dom
- **Linting**: ESLint + Prettier
- **Deployment**: GitHub Pages

## Project Structure

```
src/
├── core/          # Game loop, renderer, time management, assets
├── ecs/           # Components, systems, world management
├── entities/      # Entity factories and definitions
├── ui/            # UI overlays, menus, HUD
├── assets/        # Sprites, sounds, fonts
└── main.ts        # Entry point
```

## Setup

1. **Install dependencies**:
   ```bash
   # Use the setup script (required on Windows without admin rights):
   setup_env.bat npm install
   ```

2. **Development server**:
   ```bash
   setup_env.bat npm run dev
   ```

3. **Build for production**:
   ```bash
   setup_env.bat npm run build
   ```

4. **Run tests**:
   ```bash
   setup_env.bat npm run test
   ```

5. **Lint code**:
   ```bash
   setup_env.bat npm run lint
   ```

## Architecture

### ECS Design
- **Components**: Data-only structures (Position, Velocity, Health, etc.)
- **Systems**: Functions that operate on entities with specific component combinations
- **Entities**: IDs that group components together
- **World**: Container for all entities and components

### Game Loop
- Fixed timestep for game logic updates
- Separate render interpolation for smooth visuals
- ECS system pipeline execution
- Delta-time based movement for frame-rate independence

### Audio System
- Howler.js for audio management
- Audio sprites for efficient loading
- Event-driven sound playback
- Autoplay policy compliance

### Rendering
- Canvas 2D for performance and visual style
- Or PIXI.js for advanced features and batching
- Particle systems for effects
- Resolution scaling and DPR awareness

## Migration Strategy

The project was migrated from a single HTML file with inline JavaScript to a modular ECS architecture. Key migration areas include:

1. **Code Structure**: From monolithic to modular TypeScript
2. **Architecture**: From OOP classes to ECS pattern
3. **Audio**: From Web Audio API oscillators to Howler.js
4. **UI**: From direct DOM manipulation to event-driven system
5. **Performance**: Object pooling, ECS queries, and optimization

## Development Guidelines

### ECS Best Practices
- Systems should iterate over data, not call object methods
- Use object pools for bullets/particles to avoid GC spikes
- Keep components as pure data structures
- Separate update and render logic

### Performance
- Minimize allocations in game loop
- Use fixed timestep for physics updates
- Implement proper asset loading and caching
- Profile regularly to identify bottlenecks

### Code Quality
- Write unit tests for systems and components
- Use TypeScript for type safety
- Follow ESLint and Prettier rules
- Document complex logic with comments

## Testing

- Unit tests with Vitest for individual systems
- Happy-dom for DOM-related tests
- E2E tests with Playwright for game flow
- CI integration with linting and testing

## Deployment

- GitHub Actions workflow for automatic deployment
- GitHub Pages hosting
- Built artifacts in `dist/` directory
- Proper base URL configuration for subdirectory hosting

## Future Enhancements

- Multiplayer support
- Advanced particle effects
- Level editor
- Save system
- Mobile touch controls
- Accessibility features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is private and intended for internal use only.