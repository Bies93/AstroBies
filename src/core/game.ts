// Game class - main game controller
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private running: boolean = false;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public start(): void {
    if (!this.running) {
      this.running = true;
      this.gameLoop();
    }
  }

  public stop(): void {
    this.running = false;
  }

  private gameLoop(): void {
    if (!this.running) return;

    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Implement ECS-based game logic
    // TODO: Implement rendering pipeline

    requestAnimationFrame(() => this.gameLoop());
  }
}