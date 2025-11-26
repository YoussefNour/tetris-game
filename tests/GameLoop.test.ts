import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameLoop } from '../src/engine/GameLoop';

/**
 * GameLoop tests
 * TODO: Add comprehensive game loop timing tests
 */
describe('GameLoop', () => {
  let gameLoop: GameLoop;

  beforeEach(() => {
    gameLoop = new GameLoop();
  });

  describe('initialization', () => {
    it('should not be running initially', () => {
      expect(gameLoop.running).toBe(false);
    });
  });

  describe('start / stop', () => {
    it('should start the game loop', () => {
      gameLoop.start();
      expect(gameLoop.running).toBe(true);
    });

    it('should stop the game loop', () => {
      gameLoop.start();
      gameLoop.stop();
      expect(gameLoop.running).toBe(false);
    });

    it('should not start if already running', () => {
      gameLoop.start();
      const firstStart = gameLoop.running;
      gameLoop.start();
      expect(gameLoop.running).toBe(firstStart);
    });
  });

  describe('callbacks', () => {
    it('should call update callback', () => {
      const updateCallback = vi.fn();
      gameLoop.setUpdateCallback(updateCallback);

      // TODO: Test that callback is called during loop
    });

    it('should call render callback', () => {
      const renderCallback = vi.fn();
      gameLoop.setRenderCallback(renderCallback);

      // TODO: Test that callback is called during loop
    });
  });

  // TODO: Add fixed timestep tests
  // TODO: Add interpolation tests
});
