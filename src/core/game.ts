import { initializeWorld, createPlayer, getState } from '../ecs/world';
import { movementSystem, lifetimeSystem, spawnSystem, shootingSystem, collisionSystem, damageAndDespawnSystem, progressionSystem, playerControlSystem } from '../ecs/systems';
import { Renderer2D } from '../render/renderer2d';
import { HUD } from '../ui/hud';
import { Input } from './input';
import { CONFIG } from '../config';
import { Audio } from './audio';

// Game class - main game controller
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer2D;
  private hud: HUD;
  private input: Input;
  private world = initializeWorld();
  private running = false;
  private accumulator = 0;
  private lastTs = 0;

  constructor(canvas: HTMLCanvasElement, hudRoot: HTMLElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');
    this.ctx = ctx;
    this.renderer = new Renderer2D(this.canvas, this.ctx);
    this.hud = new HUD(hudRoot);
    this.input = new Input(canvas);
    this.input.onFirstInteraction(() => Audio.unlock());
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Create player
    createPlayer(this.world, this.canvas.width / this.renderer.dpr / 4, this.canvas.height / this.renderer.dpr / 2);
  }

  private handleResize() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const w = this.canvas.clientWidth || this.canvas.parentElement!.clientWidth;
    const h = this.canvas.clientHeight || this.canvas.parentElement!.clientHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.renderer.setDPR(dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTs = performance.now();
    requestAnimationFrame((ts) => this.loop(ts));
  }

  public stop(): void { this.running = false; }

  private loop(ts: number): void {
    if (!this.running) return;
    const dtMs = ts - this.lastTs; this.lastTs = ts;
    let dt = Math.min(0.25, dtMs / 1000);
    this.accumulator += dt;
    const step = CONFIG.fixedDelta;

    // Fixed-step update
    while (this.accumulator >= step) {
      getState(this.world).time += step;
      const isShooting = this.input.isPointerDown || this.input.keys.has('Space');
      playerControlSystem(this.world, this.input);
      movementSystem(this.world, step);
      spawnSystem(this.world, step, this.canvas.width / this.renderer.dpr, this.canvas.height / this.renderer.dpr);
      shootingSystem(this.world, step, isShooting);
      lifetimeSystem(this.world, step);
      collisionSystem(this.world);
      damageAndDespawnSystem(this.world);
      progressionSystem(this.world);
      this.accumulator -= step;
    }

    // Render
    this.renderer.clear();
    this.renderer.renderWorld(this.world);

    // HUD
    this.hud.update(getState(this.world));

    requestAnimationFrame((now) => this.loop(now));
  }
}
