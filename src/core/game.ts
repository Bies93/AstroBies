import { initializeWorld, createPlayer, getState, syncPlayerState } from '../ecs/world';
import {
  movementSystem,
  lifetimeSystem,
  spawnSystem,
  shootingSystem,
  collisionSystem,
  damageAndDespawnSystem,
  progressionSystem,
  playerControlSystem,
} from '../ecs/systems';
import { Renderer2D } from '../render/renderer2d';
import { HUD } from '../ui/hud';
import { Input } from './input';
import { CONFIG } from '../config';
import { Audio } from './audio';
import { ParticleSystem } from '../systems/particles';
import { Starfield } from '../systems/background';
import { ScreenShake } from '../render/screenShake';

// Game class - main game controller
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer2D;
  private hud: HUD;
  private input: Input;
  private particles = new ParticleSystem();
  private background = new Starfield();
  private shake = new ScreenShake();
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
    const width = this.canvas.width / this.renderer.dpr;
    const height = this.canvas.height / this.renderer.dpr;
    createPlayer(this.world, width * 0.25, height * 0.5);
    syncPlayerState(this.world);
  }

  private handleResize() {
    this.renderer.resize();
    const width = this.canvas.width / this.renderer.dpr;
    const height = this.canvas.height / this.renderer.dpr;
    this.background.resize(width, height);
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
    const dtMs = ts - this.lastTs;
    this.lastTs = ts;
    let dt = Math.min(0.25, dtMs / 1000);
    this.accumulator += dt;
    const step = CONFIG.fixedDelta;

    // Fixed-step update
    while (this.accumulator >= step) {
      getState(this.world).time += step;
      const isShooting = this.input.isPointerDown || this.input.keys.has('Space');
      playerControlSystem(this.world, this.input);
      movementSystem(this.world, step);
      const width = this.canvas.width / this.renderer.dpr;
      const height = this.canvas.height / this.renderer.dpr;
      spawnSystem(this.world, step, width, height);
      shootingSystem(this.world, step, isShooting, this.particles, this.shake);
      lifetimeSystem(this.world, step);
      collisionSystem(this.world, this.particles, this.shake);
      damageAndDespawnSystem(this.world, this.particles, this.shake);
      progressionSystem(this.world);
      this.accumulator -= step;
    }

    const frameDt = dtMs / 1000;
    this.background.update(frameDt);
    this.particles.syncTrails(this.world);
    this.particles.update(frameDt);

    this.renderer.render(this.world, this.background, this.particles, this.shake);

    // HUD
    syncPlayerState(this.world);
    this.hud.update(getState(this.world));

    requestAnimationFrame((now) => this.loop(now));
  }
}
