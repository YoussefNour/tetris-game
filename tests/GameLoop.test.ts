import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { GameLoop } from '../src/engine/GameLoop';

type RafMock = Mock<[callback: FrameRequestCallback], number>;
type CancelMock = Mock<[frameId: number], void>;

describe('GameLoop', () => {
  let gameLoop: GameLoop;
  let requestAnimationFrameMock: RafMock;
  let cancelAnimationFrameMock: CancelMock;
  let rafScheduledCallbacks: Array<FrameRequestCallback>;
  let fakeTime = 1000;

  beforeEach(() => {
    rafScheduledCallbacks = [];
    requestAnimationFrameMock = vi.fn<[FrameRequestCallback], number>((callback) => {
      rafScheduledCallbacks.push(callback);
      return rafScheduledCallbacks.length;
    });
    cancelAnimationFrameMock = vi.fn<[number], void>();
    vi.stubGlobal(
      'requestAnimationFrame',
      requestAnimationFrameMock as unknown as typeof globalThis.requestAnimationFrame
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      cancelAnimationFrameMock as unknown as typeof globalThis.cancelAnimationFrame
    );

    const windowMock = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('window', windowMock as unknown as Window & typeof globalThis);

    fakeTime = 1000;
    vi.spyOn(globalThis.performance, 'now').mockImplementation(() => fakeTime);

    gameLoop = new GameLoop();
  });

  afterEach(() => {
    gameLoop.stop();
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should not be running initially', () => {
      expect(gameLoop.running).toBe(false);
    });
  });

  describe('start / stop', () => {
    it('should start the game loop and schedule frames', () => {
      gameLoop.start();
      expect(gameLoop.running).toBe(true);
      expect(requestAnimationFrameMock).toHaveBeenCalled();
    });

    it('should stop the loop and cancel the scheduled frame', () => {
      gameLoop.start();
      const firstResult = requestAnimationFrameMock.mock.results[0];
      expect(firstResult).toBeDefined();
      if (!firstResult) {
        throw new Error('No animation frame was scheduled before stop');
      }
      const firstFrameId = firstResult.value as number;
      gameLoop.stop();
      expect(cancelAnimationFrameMock).toHaveBeenCalledWith(firstFrameId);
      expect(gameLoop.running).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should invoke update, render, and stats callbacks during tick', () => {
      const renderCallback = vi.fn();
      const statsCallback = vi.fn();
      const updateCallback = vi.fn(() => ({ score: 0, level: 0, lines: 0 }));

      gameLoop.setRenderCallback(renderCallback);
      gameLoop.setStatsCallback(statsCallback);
      gameLoop.setUpdateCallback(updateCallback);

      gameLoop.start();

      const scheduledTick = rafScheduledCallbacks.pop();
      expect(scheduledTick).toBeDefined();

      fakeTime += 150;
      scheduledTick?.(fakeTime);

      expect(updateCallback).toHaveBeenCalled();
      expect(renderCallback).toHaveBeenCalledWith(expect.any(Number));
      expect(statsCallback).toHaveBeenCalled();
    });
  });

  describe('pause / resume / toggle', () => {
    it('should toggle pause and resume correctly', () => {
      gameLoop.start();
      const firstResult = requestAnimationFrameMock.mock.results[0];
      expect(firstResult).toBeDefined();
      if (!firstResult) {
        throw new Error('No animation frame was scheduled before pause');
      }
      const firstFrameId = firstResult.value as number;

      gameLoop.pause();
      expect(gameLoop.isPaused).toBe(true);
      expect(cancelAnimationFrameMock).toHaveBeenCalledWith(firstFrameId);

      fakeTime += 50;
      gameLoop.resume();
      expect(gameLoop.running).toBe(true);
      expect(gameLoop.isPaused).toBe(false);
      expect(requestAnimationFrameMock).toHaveBeenCalled();

      gameLoop.togglePause();
      expect(gameLoop.isPaused).toBe(true);
    });
  });
});
