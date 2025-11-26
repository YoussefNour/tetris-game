// TODO: CODE_SMELL - Removed unused import (GameState was not used in this file)

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
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedDeltaTime = 1000 / 60; // 60 FPS
  private animationFrameId: number | null = null;

  /**
   * Callback for game logic updates
   * TODO: Connect to game state manager
   */
  private updateCallback: ((deltaTime: number) => void) | null = null;

  /**
   * Callback for rendering
   * TODO: Connect to renderer
   */
  private renderCallback: ((interpolation: number) => void) | null = null;

  /**
   * Set the update callback
   * @param callback - Function to call for game logic updates
   */
  public setUpdateCallback(callback: (deltaTime: number) => void): void {
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
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
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
  }

  /**
   * Main loop iteration (called by requestAnimationFrame)
   *
   * @param currentTime - Current timestamp from requestAnimationFrame
   */
  private tick(currentTime: number): void {
    if (!this.isRunning) return;

    // Calculate delta time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death if frame rate drops too low
    // Max 1 second catch-up
    const cappedDeltaTime = Math.min(deltaTime, 1000);

    this.accumulator += cappedDeltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.fixedDeltaTime) {
      if (this.updateCallback) {
        this.updateCallback(this.fixedDeltaTime);
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
