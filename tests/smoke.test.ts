import { describe, it, expect } from 'vitest';
import { initializeWorld, createPlayer } from '../src/ecs/world';
import { movementSystem, progressionSystem } from '../src/ecs/systems';

describe('Smoke: world + systems', () => {
  it('initializes and runs movement/progression without errors', () => {
    const w = initializeWorld();
    const p = createPlayer(w, 10, 10);
    // run a couple ticks
    for (let i = 0; i < 5; i++) {
      movementSystem(w, 1/60);
      progressionSystem(w);
    }
    expect((w as any).state.wave).toBeGreaterThanOrEqual(1);
  });
});

