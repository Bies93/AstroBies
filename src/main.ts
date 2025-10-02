// Main entry point for the game
import { Game } from './core/game';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud') as HTMLElement;
  const game = new Game(canvas, hudRoot);
  game.start();
});
