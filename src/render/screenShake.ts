export class ScreenShake {
  private magnitude = 0;

  bump(amount: number): void {
    this.magnitude = Math.min(this.magnitude + amount, 28);
  }

  pre(ctx: CanvasRenderingContext2D): boolean {
    if (this.magnitude <= 0) return false;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * this.magnitude, (Math.random() - 0.5) * this.magnitude);
    return true;
  }

  post(ctx: CanvasRenderingContext2D, used: boolean): void {
    if (used) ctx.restore();
    if (this.magnitude > 0) {
      this.magnitude *= 0.9;
      if (this.magnitude < 0.5) this.magnitude = 0;
    }
  }

  reset(): void {
    this.magnitude = 0;
  }
}
