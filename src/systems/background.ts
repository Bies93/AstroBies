interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  parallax: number;
}

export class Starfield {
  private stars: Star[] = [];
  private width = 0;
  private height = 0;

  constructor(private count = 160) {}

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.stars = new Array(this.count).fill(0).map(() => this.createStar());
  }

  private createStar(): Star {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: 0.8 + Math.random() * 1.8,
      baseAlpha: 0.35 + Math.random() * 0.45,
      alpha: 0.4,
      twinkleSpeed: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      parallax: 0.15 + Math.random() * 0.85,
    };
  }

  update(dt: number): void {
    if (!this.width || !this.height) return;
    const driftSpeed = 12;
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.phase += dt * star.twinkleSpeed;
      star.alpha = star.baseAlpha + Math.sin(star.phase) * 0.35;
      star.y += dt * driftSpeed * star.parallax;
      if (star.y > this.height + star.radius * 4) {
        star.y = -star.radius * 4;
        star.x = Math.random() * this.width;
        star.phase = Math.random() * Math.PI * 2;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.width || !this.height) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(150, 220, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
