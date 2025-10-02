// ECS World
import { createWorld, createEntity, addComponent } from 'bitecs';
import { Position, Velocity, Health, Size, Render, Player, Enemy, Bullet } from './components';

// Define the World type
export type World = ReturnType<typeof createWorld>;

// Create and export the main world instance
export const world = createWorld(1000); // Max 1000 entities

// Initialize the world
export function initializeWorld(): World {
  return createWorld(1000);
}

// Entity factory functions would go here
// TODO: Add entity creation utilities