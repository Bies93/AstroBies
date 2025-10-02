import { Howl, Howler } from 'howler';

class AudioBus {
  private unlocked = false;
  private master = 1;
  private sShoot: Howl;

  constructor() {
    this.sShoot = new Howl({ src: [], sprite: {} }); // to be loaded later
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
  }

  setVolume(v: number) { this.master = Math.max(0, Math.min(1, v)); Howler.volume(this.master); }
  mute() { this.setVolume(0); }
  unmute() { this.setVolume(1); }

  shoot() { try { this.sShoot.play(); } catch {}
  }
}

export const Audio = new AudioBus();
