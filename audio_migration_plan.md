# Audio System Migration Plan: From Web Audio API to Howler.js

## Current State

The current audio system uses Web Audio API with oscillator-based sound generation:
- Direct oscillator creation and manipulation
- Manual gain node management
- Procedural sound effects (shoot, hit, explosion, powerup)
- Audio context created immediately on page load

## Migration Goals

1. Replace oscillator-based sounds with Howler.js
2. Implement audio sprites for efficient loading
3. Add proper audio management and caching
4. Handle autoplay policies correctly
5. Maintain or improve audio quality

## Howler.js Implementation Plan

### 1. Audio Manager Class
```typescript
// src/core/audioManager.ts
import { Howl, Howler } from 'howler';

export class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  
  constructor() {
    // Initialize after user interaction
    this.setupAudioContext();
  }
  
  private setupAudioContext(): void {
    // Howler handles audio context unlocking automatically
    // but we can additional setup here if needed
  }
  
  public loadSound(id: string, src: string | string[], options: any = {}): void {
    const sound = new Howl({
      src,
      ...options
    });
    this.sounds.set(id, sound);
  }
  
  public playSound(id: string, options: any = {}): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.play(null, options);
    }
  }
  
  public stopSound(id: string): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.stop();
    }
  }
  
  public setVolume(volume: number): void {
    Howler.volume(volume);
  }
}
```

### 2. Sound Asset Organization
- Create `src/assets/sounds/` directory
- Organize sounds by type (sfx/, music/, voice/)
- Implement audio sprite technique for small sounds
- Add fallback mechanisms

### 3. Migration Steps
1. Create audio manager singleton
2. Define all current sound effects as Howler instances
3. Replace oscillator calls with Howler playback
4. Implement proper audio context unlocking after user interaction
5. Add audio settings (volume, mute) to game options

### 4. Sound Mapping
Current procedural sounds to Howler.js equivalents:
- 'shoot' → laser/pew sound effect
- 'hit' → impact/damage sound effect  
- 'explosion' → explosion sound effect
- 'powerup' → collectible/upgrade sound effect

### 5. Autoplay Policy Compliance
- Audio playback only after first user interaction
- Implement audio unlock mechanism
- Graceful degradation if audio fails to unlock

## Implementation Timeline

### Phase 1: Setup
- [ ] Create AudioManager class
- [ ] Install and configure Howler.js
- [ ] Set up basic sound loading

### Phase 2: Migration
- [ ] Replace all oscillator-based sounds
- [ ] Implement audio sprite system
- [ ] Add audio settings UI

### Phase 3: Optimization
- [ ] Add audio preloading and caching
- [ ] Implement 3D positional audio if needed
- [ ] Add audio quality settings

## Benefits of Migration

1. **Better Performance**: Howler.js optimizes audio playback
2. **Cross-browser Compatibility**: Handles browser differences automatically
3. **Audio Sprites**: Efficient loading and playback of multiple sounds
4. **Mobile Support**: Better handling of mobile audio limitations
5. **Audio Management**: Built-in volume, spatial audio, and effects support