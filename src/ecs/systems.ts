// ECS Systems
import { defineQuery, removeEntity } from 'bitecs';
import { World, createEnemy, createBullet } from './world';
import { Position, Velocity, Size, Health, Enemy, Player, Bullet, Lifetime, Damage, Render, Seeker, Rotation } from './components';
import { CONFIG } from '../config';
import { ParticleSystem } from '../systems/particles';
import { ScreenShake } from '../render/screenShake';

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
    const margin = 16;
    const side = Math.floor(Math.random() * 4); // 0:top,1:right,2:bottom,3:left
    let x = 0, y = 0;
    switch (side) {
      case 0: // top
        x = Math.random() * width;
        y = -margin;
        break;
      case 1: // right
        x = width + margin;
        y = Math.random() * height;
        break;
      case 2: // bottom
        x = Math.random() * width;
        y = height + margin;
        break;
      default: // left
        x = -margin;
        y = Math.random() * height;
        break;
    }
    const base = 40;
    const speed = base + Math.random() * 40 + state.wave * 2;
    createEnemy(world, x, y, speed);
  }
}

// Shooting: create bullets from player if control set by outer loop
const playerQ = defineQuery([Player, Position]);
let shootCooldown = 0;
export function shootingSystem(
  world: World,
  dt: number,
  isShooting: boolean,
  particles: ParticleSystem,
  shake: ScreenShake,
  pointer?: { x: number; y: number },
): void {
  shootCooldown -= dt;
  if (!isShooting || shootCooldown > 0) return;
  const players = playerQ(world);
  if (players.length === 0) return;
  const p = players[0];
  const px = Position.x[p];
  const py = Position.y[p];
  let dirx = 1, diry = 0;
  if (pointer) {
    const dx = pointer.x - px;
    const dy = pointer.y - py;
    const len = Math.hypot(dx, dy) || 1;
    dirx = dx / len;
    diry = dy / len;
  }
  const bulletSpeed = 320;
  const bx = px + dirx * 16;
  const by = py + diry * 16;
  const bullet = createBullet(world, bx, by, dirx * bulletSpeed, diry * bulletSpeed, 5);
  particles.muzzleFlash(Position.x[bullet], Position.y[bullet]);
  shake.bump(2.5);
  shootCooldown = 0.15;
}

// Enemy AI: steer velocity towards player each tick
const enemyAIQ = defineQuery([Enemy, Position, Velocity, Seeker]);
export function enemyAISystem(world: World): void {
  const enemies = enemyAIQ(world);
  const players = playerQ(world);
  if (players.length === 0) return;
  const p = players[0];
  const px = Position.x[p];
  const py = Position.y[p];
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const dx = px - Position.x[e];
    const dy = py - Position.y[e];
    const len = Math.hypot(dx, dy) || 1;
    const sp = Seeker.speed[e] || 40;
    Velocity.vx[e] = (dx / len) * sp;
    Velocity.vy[e] = (dy / len) * sp;
  }
}

// Player control: set velocity from input state
export function playerControlSystem(world: World, input: { keys: Set<string>; pointer?: { x: number; y: number } }, speed = CONFIG.playerSpeed) {
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
    // Update rotation to face pointer if available
    if (input.pointer) {
      const dx = input.pointer.x - Position.x[p];
      const dy = input.pointer.y - Position.y[p];
      Rotation.angle[p] = Math.atan2(dy, dx);
    }
  }
}

// AABB collision helper
function aabb(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Collision: Bullet–Enemy and Player–Enemy
const enemyQ = defineQuery([Enemy, Position, Size, Health, Render]);
const bulletQ = defineQuery([Bullet, Position, Size, Damage, Render]);
const playerHitQ = defineQuery([Player, Position, Size, Health]);
export function collisionSystem(world: World, particles: ParticleSystem, shake: ScreenShake): void {
  const enemies = enemyQ(world);
  const bullets = bulletQ(world);
  const players = playerHitQ(world);

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
        if (Health.current[e] < 0) Health.current[e] = 0;
        const color = `rgba(${Render.r[e]}, ${Render.g[e]}, ${Render.b[e]}, 1)`;
        particles.hitBurst(Position.x[e], Position.y[e], color);
        shake.bump(5);
        removeEntity(world, b);
        break;
      }
    }
  }

  if (players.length === 0) return;

  const player = players[0];
  for (let ei = 0; ei < enemies.length; ei++) {
    const e = enemies[ei];
    if (
      aabb(
        Position.x[player], Position.y[player], Size.width[player], Size.height[player],
        Position.x[e], Position.y[e], Size.width[e], Size.height[e]
      )
    ) {
      Health.current[player] -= 15;
      if (Health.current[player] < 0) Health.current[player] = 0;
      particles.hitBurst(Position.x[player], Position.y[player], 'rgba(0,255,255,0.9)');
      shake.bump(9);
      removeEntity(world, e);
    }
  }
}

// Damage + despawn
export function damageAndDespawnSystem(world: World, particles: ParticleSystem, shake: ScreenShake): void {
  const enemies = enemyQ(world);
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (Health.current[e] <= 0) {
      const color = `rgba(${Render.r[e]}, ${Render.g[e]}, ${Render.b[e]}, 1)`;
      particles.explosion(Position.x[e], Position.y[e], color);
      shake.bump(12);
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
