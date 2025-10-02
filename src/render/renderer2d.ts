import { defineQuery } from 'bitecs';
import { Bullet, Enemy, Health, Player, Position, Render, Size, Velocity } from '../ecs/components';
import type { World } from '../ecs/world';
import { drawPlayer } from './drawPlayer';
import { drawEnemy } from './drawEnemy';
import { drawBullet } from './drawBullet';
import { ParticleSystem } from '../systems/particles';
import { Starfield } from '../systems/background';
import { ScreenShake } from './screenShake';

const playerQuery = defineQuery([Player, Position, Velocity, Size, Health]);
const enemyQuery = defineQuery([Enemy, Position, Velocity, Size, Health, Render]);
const bulletQuery = defineQuery([Bullet, Position, Velocity, Size, Render]);

function rgba(r: number, g: number, b: number, a = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { clientWidth, clientHeight } = canvas;
  const width = clientWidth || canvas.getBoundingClientRect().width;
  const height = clientHeight || canvas.getBoundingClientRect().height;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return dpr;
}

export class Renderer2D {
  public dpr = 1;
  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {}

  resize(): void {
    this.dpr = resizeCanvas(this.canvas, this.ctx);
  }

  render(world: World, background: Starfield, particles: ParticleSystem, shake: ScreenShake): void {
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    // Background fade for motion trails
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
    this.ctx.fillRect(0, 0, width, height);

    background.draw(this.ctx);

    const usedShake = shake.pre(this.ctx);

    // Draw enemies with glow
    const enemies = enemyQuery(world);
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const x = Position.x[e];
      const y = Position.y[e];
      const r = Math.max(Size.width[e], Size.height[e]) * 0.6;
      const color = rgba(Render.r[e], Render.g[e], Render.b[e]);
      drawEnemy(this.ctx, x, y, r, color, Health.current[e], Health.max[e]);
    }

    // Draw player with neon gradient
    const players = playerQuery(world);
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const x = Position.x[p];
      const y = Position.y[p];
      const r = Math.max(Size.width[p], Size.height[p]) * 0.65;
      drawPlayer(this.ctx, x, y, r, Velocity.vx[p], Velocity.vy[p]);
    }

    // Draw bullets last so they bloom on top
    const bullets = bulletQuery(world);
    for (let i = 0; i < bullets.length; i++) {
      const b = bullets[i];
      const x = Position.x[b];
      const y = Position.y[b];
      const r = Math.max(Size.width[b], Size.height[b]) * 0.5;
      const color = rgba(Render.r[b], Render.g[b], Render.b[b]);
      drawBullet(this.ctx, x, y, r, color);
    }

    particles.draw(this.ctx);

    shake.post(this.ctx, usedShake);
  }
}
