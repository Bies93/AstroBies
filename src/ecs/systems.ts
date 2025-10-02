// ECS Systems
import { defineQuery, removeEntity } from 'bitecs';
import { World, createEnemy, createBullet } from './world';
import { Position, Velocity, Size, Health, Enemy, Player, Bullet, Lifetime, Damage } from './components';
import { CONFIG } from '../config';

// Movement: p += v * dt
const moveQ = defineQuery([Position, Velocity]);
export function movementSystem(world: World, dt: number): void {
  const ents = moveQ(world);
  for (let i = 0; i < ents.length; i++) {
    const e = ents[i];
    Position.x[e] += Velocity.vx[e] * dt;
    Position.y[e] += Velocity.vy[e] * dt;
  }
}

// Lifetime: countdown and despawn
const lifeQ = defineQuery([Lifetime]);
export function lifetimeSystem(world: World, dt: number): void {
  const ents = lifeQ(world);
  for (let i = 0; i < ents.length; i++) {
    const e = ents[i];
    Lifetime.timeLeft[e] -= dt;
    if (Lifetime.timeLeft[e] <= 0) {
      removeEntity(world, e);
    }
  }
}

// Simple spawner: spawn enemies from right edge periodically
let spawnTimer = 0;
export function spawnSystem(world: World, dt: number, width: number, height: number): void {
  spawnTimer += dt;
  const state = (world as any).state as { wave: number };
  const interval = Math.max(0.3, 1.2 - state.wave * 0.05);
  if (spawnTimer >= interval) {
    spawnTimer = 0;
    const y = Math.random() * (height - 20) + 10;
    createEnemy(world, width + 10, y, 40 + Math.random() * 40);
  }
}

// Shooting: create bullets from player if control set by outer loop
const playerQ = defineQuery([Player, Position]);
let shootCooldown = 0;
export function shootingSystem(world: World, dt: number, isShooting: boolean): void {
  shootCooldown -= dt;
  if (!isShooting || shootCooldown > 0) return;
  const players = playerQ(world);
  if (players.length === 0) return;
  const p = players[0];
  createBullet(world, Position.x[p] + 16, Position.y[p], 300, 0, 5);
  shootCooldown = 0.15;
}

// Player control: set velocity from input state
export function playerControlSystem(world: World, input: { keys: Set<string> }, speed = CONFIG.playerSpeed) {
  const players = playerQ(world);
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    let vx = 0, vy = 0;
    if (input.keys.has('W') || input.keys.has('ArrowUp')) vy -= 1;
    if (input.keys.has('S') || input.keys.has('ArrowDown')) vy += 1;
    if (input.keys.has('A') || input.keys.has('ArrowLeft')) vx -= 1;
    if (input.keys.has('D') || input.keys.has('ArrowRight')) vx += 1;
    const len = Math.hypot(vx, vy) || 1;
    Velocity.vx[p] = (vx / len) * speed;
    Velocity.vy[p] = (vy / len) * speed;
  }
}

// AABB collision helper
function aabb(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Collision: Bullet–Enemy and Player–Enemy
const enemyQ = defineQuery([Enemy, Position, Size, Health]);
const bulletQ = defineQuery([Bullet, Position, Size, Damage]);
export function collisionSystem(world: World): void {
  const enemies = enemyQ(world);
  const bullets = bulletQ(world);

  // Bullet–Enemy
  for (let bi = 0; bi < bullets.length; bi++) {
    const b = bullets[bi];
    for (let ei = 0; ei < enemies.length; ei++) {
      const e = enemies[ei];
      if (
        aabb(
          Position.x[b], Position.y[b], Size.width[b], Size.height[b],
          Position.x[e], Position.y[e], Size.width[e], Size.height[e]
        )
      ) {
        Health.current[e] -= Damage.amount[b];
        removeEntity(world, b);
        break;
      }
    }
  }
}

// Damage + despawn
export function damageAndDespawnSystem(world: World): void {
  const enemies = enemyQ(world);
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (Health.current[e] <= 0) {
      removeEntity(world, e);
      const state = (world as any).state; state.score += 10;
    }
  }
}

// Score/Level update (very simple pacing)
export function progressionSystem(world: World): void {
  const state = (world as any).state as { score: number; wave: number; level: number };
  state.wave = 1 + Math.floor(state.score / 200);
  state.level = 1 + Math.floor(state.score / 500);
}
