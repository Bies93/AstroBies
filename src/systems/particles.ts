import type { World } from '../ecs/world';
import { defineQuery } from 'bitecs';
import { Bullet, Enemy, Player, Position, Render, Velocity } from '../ecs/components';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  glow: number;
  alpha: number;
  drag: number;
  rotation: number;
  spin: number;
  type: 'spark' | 'trail';
}

interface ExplosionRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
}

const bulletQuery = defineQuery([Bullet, Position, Velocity, Render]);
const enemyQuery = defineQuery([Enemy, Position, Velocity, Render]);
const playerQuery = defineQuery([Player, Position, Velocity]);

function rgba(r: number, g: number, b: number, a = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private rings: ExplosionRing[] = [];
  private maxParticles = 800;

  reset(): void {
    this.particles.length = 0;
    this.rings.length = 0;
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.spin * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.life -= dt;
      if (ring.life <= 0) {
        this.rings.splice(i, 1);
        continue;
      }
      const t = 1 - ring.life / ring.maxLife;
      ring.radius = ring.maxRadius * t * t;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const radius = p.size * (0.4 + 0.6 * (p.life / p.maxLife));
      ctx.shadowBlur = p.glow;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = p.alpha;
      if (p.type === 'trail') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const len = radius * 2.8;
        ctx.fillStyle = p.color;
        ctx.fillRect(-len * 0.5, -radius * 0.35, len, radius * 0.7);
        ctx.restore();
      } else {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, p.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const alpha = Math.max(0, ring.life / ring.maxLife);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 25;
      ctx.shadowColor = ring.color;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  private emitParticle(particle: Particle): void {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(particle);
  }

  muzzleFlash(x: number, y: number, primaryColor = 'rgba(255,220,120,1)'): void {
    for (let i = 0; i < 10; i++) {
      this.emitParticle({
        x,
        y,
        vx: (Math.random() * 60 + 80) * (0.6 + Math.random() * 0.4),
        vy: (Math.random() - 0.5) * 80,
        life: 0.18 + Math.random() * 0.12,
        maxLife: 0.3,
        size: 10 + Math.random() * 6,
        color: primaryColor,
        glow: 20,
        alpha: 1,
        drag: 0.8,
        rotation: Math.random() * Math.PI * 2,
        spin: 0,
        type: 'spark',
      });
    }
  }

  hitBurst(x: number, y: number, color: string): void {
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.2;
      const speed = 90 + Math.random() * 120;
      this.emitParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.5,
        size: 8 + Math.random() * 5,
        color,
        glow: 25,
        alpha: 1,
        drag: 0.88,
        rotation: angle,
        spin: 0,
        type: 'spark',
      });
    }
  }

  explosion(x: number, y: number, color: string): void {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 140;
      this.emitParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.45 + Math.random() * 0.4,
        maxLife: 0.7,
        size: 14 + Math.random() * 10,
        color,
        glow: 30,
        alpha: 1,
        drag: 0.86,
        rotation: angle,
        spin: 0,
        type: 'spark',
      });
    }
    this.rings.push({
      x,
      y,
      radius: 0,
      maxRadius: 120,
      life: 0.6,
      maxLife: 0.6,
      color,
    });
  }

  addTrail(x: number, y: number, angle: number, color: string, intensity = 1): void {
    const speed = 40 + Math.random() * 20;
    this.emitParticle({
      x,
      y,
      vx: Math.cos(angle) * speed * -0.3,
      vy: Math.sin(angle) * speed * -0.3,
      life: 0.3 + Math.random() * 0.15,
      maxLife: 0.45,
      size: 16 * intensity,
      color,
      glow: 18,
      alpha: 1,
      drag: 0.92,
      rotation: angle,
      spin: 0,
      type: 'trail',
    });
  }

  syncTrails(world: World): void {
    const bullets = bulletQuery(world);
    for (let i = 0; i < bullets.length; i++) {
      const b = bullets[i];
      const angle = Math.atan2(Velocity.vy[b], Velocity.vx[b] || 1e-5);
      const color = rgba(Render.r[b], Render.g[b], Render.b[b], 1);
      this.addTrail(Position.x[b], Position.y[b], angle, color, 0.4);
    }

    const enemies = enemyQuery(world);
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const velAngle = Math.atan2(Velocity.vy[e], Velocity.vx[e] || 1e-5);
      const color = rgba(Render.r[e], Render.g[e], Render.b[e], 0.9);
      this.addTrail(Position.x[e], Position.y[e], velAngle, color, 0.7);
    }

    const players = playerQuery(world);
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const velAngle = Math.atan2(Velocity.vy[p], Velocity.vx[p] || 1e-5);
      const speed = Math.hypot(Velocity.vx[p], Velocity.vy[p]);
      if (speed > 15) {
        this.addTrail(Position.x[p], Position.y[p], velAngle, 'rgba(0,255,255,0.9)', 1);
      }
    }
  }
}
