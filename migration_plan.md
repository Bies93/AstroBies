# Migration Plan: From Inline Code to Modular ECS Architecture

## Current State Analysis

The current game is implemented as a single HTML file with:
- Inline JavaScript using classes (Player, Enemy, Bullet, etc.)
- Canvas 2D rendering with immediate mode
- Direct DOM manipulation for UI updates
- Web Audio API with oscillator-based sound effects
- Game loop with mixed concerns (rendering, logic, UI updates)

## Migration Strategy

### Phase 1: ECS Architecture Implementation
- [x] Define ECS components (Position, Velocity, Health, etc.)
- [x] Create ECS systems (Movement, Collision, Rendering, etc.)
- [x] Set up ECS world management

### Phase 2: Audio System Migration
- [ ] Replace Web Audio API oscillators with Howler.js
- [ ] Create audio manager for SFX and music
- [ ] Implement audio sprites for efficient sound loading

### Phase 3: Rendering System Migration
- [ ] Decide between Canvas 2D (retained) or PIXI.js
- [ ] Create rendering pipeline using ECS
- [ ] Implement particle system with ECS

### Phase 4: Input System Migration
- [ ] Create input manager for keyboard/mouse
- [ ] Implement PointerLock and Gamepad API support
- [ ] Add touch controls for mobile

### Phase 5: Entity Migration
- [ ] Convert existing classes to ECS entities
- [ ] Create entity factories for Player, Enemies, Bullets
- [ ] Implement object pooling for performance

## Detailed Migration Steps

### 1. Core Game Loop Refactoring
Current implementation mixes concerns in a single loop. New approach:
- Fixed timestep update for game logic
- Separate render interpolation
- ECS system pipeline execution

### 2. Entity Conversion
Convert existing classes to ECS pattern:
- Player class → Entity with Position, Velocity, Health, Player components
- Enemy class → Entity with Position, Velocity, Health, Enemy, AI components
- Bullet class → Entity with Position, Velocity, Bullet components
- Particle/Trail classes → Entity with Position, Lifetime, Render components

### 3. UI System Separation
- Replace direct DOM updates with ECS-based UI system
- Use event bus for game state changes
- Implement reactive UI updates

### 4. Performance Optimizations
- Implement object pooling for bullets/particles
- Use ECS queries for efficient system processing
- Minimize garbage collection with object reuse

## Risk Mitigation

1. **Gradual Migration**: Implement ECS alongside existing code initially
2. **Feature Parity**: Maintain all existing functionality during migration
3. **Testing**: Write unit tests for each system during migration
4. **Performance Monitoring**: Profile during migration to catch regressions

## Success Criteria

- [ ] All game entities managed by ECS
- [ ] Game loop follows ECS pattern
- [ ] Performance maintained or improved
- [ ] All original features preserved
- [ ] Codebase is more maintainable and extensible