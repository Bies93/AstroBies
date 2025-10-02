export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  velocityX: number,
  velocityY: number,
): void {
  ctx.save();
  ctx.shadowBlur = 35;
  ctx.shadowColor = '#00ffff';

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.45, '#66ffff');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0.45)');
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Draw heading indicator
  const len = Math.hypot(velocityX, velocityY);
  const dirX = len > 0.01 ? velocityX / len : 1;
  const dirY = len > 0.01 ? velocityY / len : 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dirX * r * 1.6, y + dirY * r * 1.6);
  ctx.stroke();

  ctx.restore();
}
