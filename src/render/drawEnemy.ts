export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  health: number,
  maxHealth: number,
): void {
  ctx.save();
  ctx.shadowBlur = 25;
  ctx.shadowColor = color;

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  if (health < maxHealth) {
    const barWidth = r * 2;
    const barHeight = 6;
    const ratio = Math.max(0, Math.min(1, health / maxHealth));
    const left = x - r;
    const top = y - r - 12;

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(left, top, barWidth, barHeight);

    const gradientBar = ctx.createLinearGradient(left, top, left + barWidth, top);
    gradientBar.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
    gradientBar.addColorStop(1, color);
    ctx.fillStyle = gradientBar;
    ctx.fillRect(left, top, barWidth * ratio, barHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(left - 0.5, top - 0.5, barWidth + 1, barHeight + 1);
  }

  ctx.restore();
}
