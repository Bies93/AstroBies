// ECS World
import { createWorld, createEntity, addComponent, Types } from 'bitecs';
import { Position, Velocity, Health, Size, Render, Player, Enemy, Bullet, Lifetime, Damage } from './components';

export interface GameState {
  score: number;
  wave: number;
  level: number;
  time: number;
}

// Define the World type
export type World = ReturnType<typeof createWorld>;

// Create and export the main world instance
export const world = createWorld(1000); // Max 1000 entities
// Attach a small bag for global state
(world as any).state = { score: 0, wave: 1, level: 1, time: 0 } as GameState;

// Initialize the world
export function initializeWorld(): World {
  const w = createWorld(1000);
  (w as any).state = { score: 0, wave: 1, level: 1, time: 0 } as GameState;
  return w;
}

// Color helper
export function setColor(e: number, r: number, g: number, b: number, a = 1) {
  Render.r[e] = r; Render.g[e] = g; Render.b[e] = b; Render.alpha[e] = a;
}

export function createPlayer(w: World, x: number, y: number) {
  const e = createEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = 0; Velocity.vy[e] = 0; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 20; Size.height[e] = 20;
  addComponent(w, Health, e); Health.current[e] = 100; Health.max[e] = 100;
  addComponent(w, Render, e); setColor(e, 0, 255, 255, 1);
  addComponent(w, Player, e);
  return e;
}

export function getState(w: World): GameState {
  return (w as any).state as GameState;
}

export function createEnemy(w: World, x: number, y: number, speed = 40) {
  const e = createEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = -speed; Velocity.vy[e] = 0; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 16; Size.height[e] = 16;
  addComponent(w, Health, e); Health.current[e] = 10; Health.max[e] = 10;
  addComponent(w, Render, e); setColor(e, 255, 0, 102, 1);
  addComponent(w, Enemy, e);
  return e;
}

export function createBullet(w: World, x: number, y: number, vx: number, vy: number, dmg = 5) {
  const e = createEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = vx; Velocity.vy[e] = vy; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 4; Size.height[e] = 4;
  addComponent(w, Render, e); setColor(e, 255, 255, 0, 1);
  addComponent(w, Bullet, e);
  addComponent(w, Lifetime, e); Lifetime.timeLeft[e] = 2.0;
  addComponent(w, Damage, e); Damage.amount[e] = dmg;
  return e;
}
