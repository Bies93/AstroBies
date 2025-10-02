// ECS World
import { createWorld, addComponent, addEntity } from 'bitecs';
import { Position, Velocity, Health, Size, Render, Player, Enemy, Bullet, Lifetime, Damage } from './components';

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export interface GameState {
  score: number;
  wave: number;
  level: number;
  time: number;
  playerHealth: number;
  playerMaxHealth: number;
}

// Define the World type
export type World = ReturnType<typeof createWorld>;

function createInitialState(): GameState {
  return { score: 0, wave: 1, level: 1, time: 0, playerHealth: 100, playerMaxHealth: 100 };
}

// Create and export the main world instance
export const world = createWorld(1000); // Max 1000 entities
// Attach a small bag for global state
(world as any).state = createInitialState();
(world as any).player = null;

// Initialize the world
export function initializeWorld(): World {
  const w = createWorld(1000);
  (w as any).state = createInitialState();
  (w as any).player = null;
  return w;
}

// Color helper
export function setColor(e: number, r: number, g: number, b: number, a = 1) {
  Render.r[e] = r; Render.g[e] = g; Render.b[e] = b; Render.alpha[e] = a;
}

export function createPlayer(w: World, x: number, y: number) {
  const e = addEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = 0; Velocity.vy[e] = 0; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 20; Size.height[e] = 20;
  addComponent(w, Health, e); Health.current[e] = 100; Health.max[e] = 100;
  addComponent(w, Render, e); setColor(e, 0, 255, 255, 1);
  addComponent(w, Player, e);
  (w as any).player = e;
  const state = getState(w);
  state.playerHealth = Health.current[e];
  state.playerMaxHealth = Health.max[e];
  return e;
}

export function getState(w: World): GameState {
  return (w as any).state as GameState;
}

export function syncPlayerState(w: World): void {
  const player = (w as any).player as number | null;
  if (player == null) return;
  const state = getState(w);
  state.playerHealth = Math.max(0, Math.round(Health.current[player]));
  state.playerMaxHealth = Math.round(Health.max[player]);
}

export function createEnemy(w: World, x: number, y: number, speed = 40) {
  const e = addEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = -speed; Velocity.vy[e] = 0; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 16; Size.height[e] = 16;
  addComponent(w, Health, e); Health.current[e] = 10; Health.max[e] = 10;
  const hue = 300 + Math.random() * 60;
  const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);
  addComponent(w, Render, e); setColor(e, r, g, b, 1);
  addComponent(w, Enemy, e);
  return e;
}

export function createBullet(w: World, x: number, y: number, vx: number, vy: number, dmg = 5) {
  const e = addEntity(w);
  addComponent(w, Position, e); Position.x[e] = x; Position.y[e] = y; Position.z[e] = 0;
  addComponent(w, Velocity, e); Velocity.vx[e] = vx; Velocity.vy[e] = vy; Velocity.vz[e] = 0;
  addComponent(w, Size, e); Size.width[e] = 4; Size.height[e] = 4;
  addComponent(w, Render, e); setColor(e, 255, 220, 120, 1);
  addComponent(w, Bullet, e);
  addComponent(w, Lifetime, e); Lifetime.timeLeft[e] = 2.0;
  addComponent(w, Damage, e); Damage.amount[e] = dmg;
  return e;
}
