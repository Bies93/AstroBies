// ECS Components
import { defineComponent } from 'bitecs';

// Position component
export const Position = defineComponent({
  x: 'f32',
  y: 'f32',
  z: 'f32',
});

// Velocity component
export const Velocity = defineComponent({
  vx: 'f32',
  vy: 'f32',
  vz: 'f32',
});

// Health component
export const Health = defineComponent({
  current: 'f32',
  max: 'f32',
});

// Size component
export const Size = defineComponent({
  width: 'f32',
  height: 'f32',
});

// Render component
export const Render = defineComponent({
 color: 'ui8',
  alpha: 'f32',
});

// Player tag component
export const Player = defineComponent();

// Enemy tag component
export const Enemy = defineComponent();

// Bullet tag component
export const Bullet = defineComponent();