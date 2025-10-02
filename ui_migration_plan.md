# UI System Migration Plan: From DOM-based to ECS-Integrated UI

## Current State

The current UI system uses:
- Direct DOM manipulation for score, health, wave, level display
- Inline CSS styling
- Direct DOM queries in game loop (anti-pattern)
- Separate HTML elements for UI overlays (combo display, game over screen)

## Migration Goals

1. Separate UI rendering from game logic
2. Eliminate direct DOM queries in game loop
3. Implement ECS-based UI system
4. Consider canvas-based UI rendering
5. Maintain current visual design while improving architecture

## Migration Options

### Option A: Retained DOM UI (Recommended for now)
- Keep current DOM-based UI structure
- Implement event-driven UI updates
- Use ECS events to trigger UI changes instead of direct DOM queries

### Option B: Canvas-based UI
- Render UI elements directly on canvas
- Better performance for frequently updated elements
- Consistent rendering pipeline
- More complex implementation

### Option C: Hybrid Approach
- Keep overlays (game over, combo) as DOM elements
- Render in-game HUD (health bar, score) on canvas
- Use Web Components for complex UI elements

## Recommended: Event-Driven DOM UI

### 1. UI Event System
```typescript
// src/core/eventBus.ts
export class EventBus {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  
  public on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
 }
  
  public emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
 }
}
```

### 2. UI System Implementation
```typescript
// src/ui/uiSystem.ts
import { EventBus } from '../core/eventBus';

export class UISystem {
  private eventBus: EventBus;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.eventBus.on('scoreChanged', (score) => this.updateScore(score));
    this.eventBus.on('healthChanged', (healthData) => this.updateHealth(healthData));
    this.eventBus.on('waveChanged', (wave) => this.updateWave(wave));
    // etc.
  }
  
  private updateScore(score: number): void {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
 }
  
  // Other update methods...
}
```

### 3. Integration with ECS
- Create UI components for ECS entities
- Use ECS events to trigger UI updates
- Implement reactive UI patterns

## Migration Steps

### Phase 1: Event System
- [ ] Create event bus system
- [ ] Identify all UI update points in current code
- [ ] Replace direct DOM queries with event emissions

### Phase 2: UI System
- [ ] Create dedicated UI system
- [ ] Implement event-driven UI updates
- [ ] Remove DOM queries from game loop

### Phase 3: ECS Integration
- [ ] Add UI components to ECS entities
- [ ] Create UI-specific systems
- [ ] Implement state management for UI

## Current UI Elements Mapping

1. **Score Display** (`#score`) - Convert to event-driven
2. **Health Bar** (`#healthFill`, `#healthText`) - Event-driven updates
3. **Wave Display** (`#wave`) - Event-driven
4. **Level Display** (`#level`) - Event-driven
5. **Combo Display** (`#comboDisplay`, `#comboCount`) - Show/hide with events
6. **Game Over Screen** (`#gameOver`) - Event-driven visibility
7. **Final Stats** (`#finalScore`, `#finalWave`, `#maxCombo`) - Event-driven

## Benefits of Migration

1. **Performance**: Eliminate DOM queries in game loop
2. **Maintainability**: Clear separation of concerns
3. **Reactivity**: UI updates only when data changes
4. **Testability**: UI logic becomes more testable
5. **Scalability**: Easier to add new UI elements

## Future Enhancements

- Consider canvas-based HUD rendering for better performance
- Implement Web Components for complex UI elements
- Add UI animations and transitions
- Create UI theming system

## Timeline

- **Week 1**: Event system implementation
- **Week 2**: UI system creation and DOM query removal
- **Week 3**: ECS integration and testing
- **Week 4**: Performance optimization and refinements