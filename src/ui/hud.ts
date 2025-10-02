import type { GameState } from '../ecs/world';

export class HUD {
  private root: HTMLElement;
  private scoreEl: HTMLElement;
  private waveEl: HTMLElement;
  private levelEl: HTMLElement;
  private healthFillEl: HTMLElement;
  private healthTextEl: HTMLElement;

  private last: Partial<GameState> = {};

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.innerHTML = `
      <div class="hud-container">
        <div class="hud-row">
          <div class="hud-pill">⭐ SCORE: <span data-hud="score">0</span></div>
        </div>
        <div class="hud-row hud-health-block">
          <div class="hud-label">❤️ HEALTH</div>
          <div class="hud-health">
            <div class="hud-health-fill" data-hud="health-fill"></div>
            <div class="hud-health-text" data-hud="health-text">100 / 100</div>
          </div>
        </div>
        <div class="hud-row hud-inline">
          <div class="hud-pill">🌊 WAVE: <span data-hud="wave">1</span></div>
          <div class="hud-pill">🎯 LEVEL: <span data-hud="level">1</span></div>
        </div>
      </div>`;
    this.scoreEl = this.root.querySelector('[data-hud="score"]') as HTMLElement;
    this.waveEl = this.root.querySelector('[data-hud="wave"]') as HTMLElement;
    this.levelEl = this.root.querySelector('[data-hud="level"]') as HTMLElement;
    this.healthFillEl = this.root.querySelector('[data-hud="health-fill"]') as HTMLElement;
    this.healthTextEl = this.root.querySelector('[data-hud="health-text"]') as HTMLElement;
  }

  update(s: GameState) {
    if (s.score !== this.last.score) this.scoreEl.textContent = String(s.score);
    if (s.wave !== this.last.wave) this.waveEl.textContent = String(s.wave);
    if (s.level !== this.last.level) this.levelEl.textContent = String(s.level);
    if (
      s.playerHealth !== this.last.playerHealth ||
      s.playerMaxHealth !== this.last.playerMaxHealth
    ) {
      const ratio = s.playerMaxHealth > 0 ? s.playerHealth / s.playerMaxHealth : 0;
      this.healthFillEl.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
      this.healthTextEl.textContent = `${Math.max(0, Math.round(s.playerHealth))} / ${Math.round(s.playerMaxHealth)}`;
    }
    this.last = { ...s };
  }
}

