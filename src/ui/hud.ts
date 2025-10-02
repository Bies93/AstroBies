import type { GameState } from '../ecs/world';

export class HUD {
  private root: HTMLElement;
  private scoreEl: HTMLElement;
  private waveEl: HTMLElement;
  private levelEl: HTMLElement;

  private last: Partial<GameState> = {};

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.innerHTML = `
      <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,255,255,0.3);padding:8px 12px;border-radius:6px;pointer-events:none;">
        <div>Score: <span id="hud-score">0</span></div>
        <div>Wave: <span id="hud-wave">1</span></div>
        <div>Level: <span id="hud-level">1</span></div>
      </div>`;
    this.scoreEl = this.root.querySelector('#hud-score') as HTMLElement;
    this.waveEl = this.root.querySelector('#hud-wave') as HTMLElement;
    this.levelEl = this.root.querySelector('#hud-level') as HTMLElement;
  }

  update(s: GameState) {
    if (s.score !== this.last.score) this.scoreEl.textContent = String(s.score);
    if (s.wave !== this.last.wave) this.waveEl.textContent = String(s.wave);
    if (s.level !== this.last.level) this.levelEl.textContent = String(s.level);
    this.last = { ...s };
  }
}

