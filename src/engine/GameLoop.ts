/* eslint-env browser */

import type { GameStatistics } from '@core/types';

/**
 * GameLoop manages the main game loop using requestAnimationFrame.
 * Implements fixed timestep for game logic and variable rendering.
 *
 * TODO: Implement the following methods:
 * - start(): Begin the game loop
 * - stop(): Stop the game loop
 * - tick(): Main loop iteration
 * - update(): Fixed timestep game logic update
 * - render(): Variable timestep rendering
 *
 * @see ARCHITECTURE.md for game loop design details
 */
export class GameLoop {
  private isRunning = false;
  private paused = false;
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedDeltaTime = 1000 / 60; // 60 FPS
  private animationFrameId: number | null = null;
  private escapeListenerAttached = false;

  /**
   * Callback for game logic updates that can optionally return stats.
   */
  private updateCallback: ((deltaTime: number) => GameStatistics | void) | null = null;

  /**
   * Callback for statistics updates (score/level/lines)
   */
  private statsCallback: ((stats: GameStatistics) => void) | null = null;

  /**
   * Callback for rendering
   * TODO: Connect to renderer
   */
  private renderCallback: ((interpolation: number) => void) | null = null;

  /**
   * Set the update callback
   * @param callback - Function to call for game logic updates
   */
  public setUpdateCallback(callback: (deltaTime: number) => GameStatistics | void): void {
    this.updateCallback = callback;
  }

  /**
   * Set the render callback
   * @param callback - Function to call for rendering
   */
  public setRenderCallback(callback: (interpolation: number) => void): void {
    this.renderCallback = callback;
  }

  /**
   * Register a stats callback (score, level, lines)
   */
  public setStatsCallback(callback: (stats: GameStatistics) => void): void {
    this.statsCallback = callback;
  }

  /**
   * Escape key handler used for pausing/resuming the loop.
   */
  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.togglePause();
    }
  };

  private attachEscapeListener(): void {
    if (this.escapeListenerAttached) return;
    window.addEventListener('keydown', this.handleEscapeKey);
    this.escapeListenerAttached = true;
  }

  private detachEscapeListener(): void {
    if (!this.escapeListenerAttached) return;
    window.removeEventListener('keydown', this.handleEscapeKey);
    this.escapeListenerAttached = false;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.paused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.attachEscapeListener();
    this.tick(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.paused = false;
    this.detachEscapeListener();
  }

  /**
   * Pause the game loop without resetting state.
   */
  public pause(): void {
    if (!this.isRunning || this.paused) return;
    this.paused = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the game loop after a pause.
   */
  public resume(): void {
    if (!this.isRunning || !this.paused) return;
    this.paused = false;
    this.lastTime = performance.now();
    this.attachEscapeListener();
    this.tick(this.lastTime);
  }

  /**
   * Toggle pause/resume
   */
  public togglePause(): void {
    if (!this.isRunning) return;
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Main loop iteration (called by requestAnimationFrame)
   *
   * @param currentTime - Current timestamp from requestAnimationFrame
   */
  private tick(currentTime: number): void {
    if (!this.isRunning || this.paused) return;

    // Calculate delta time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death if frame rate drops too low
    // Max 1 second catch-up
    const cappedDeltaTime = Math.min(deltaTime, 1000);

    this.accumulator += cappedDeltaTime;

    // Fixed timestep updates
    const updateCallback = this.updateCallback;
    while (this.accumulator >= this.fixedDeltaTime) {
      if (updateCallback) {
        const stats = updateCallback(this.fixedDeltaTime);
        if (stats && this.statsCallback) {
          this.statsCallback(stats);
        }
      }
      this.accumulator -= this.fixedDeltaTime;
    }

    // Variable rendering with interpolation
    const interpolation = this.accumulator / this.fixedDeltaTime;
    if (this.renderCallback) {
      this.renderCallback(interpolation);
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame((time) => this.tick(time));
  }

  /**
   * Get current running status
   */
  public get running(): boolean {
    return this.isRunning;
  }
}
