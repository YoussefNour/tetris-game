import type { InputCommand, GameState } from '@core/types';
import { GAME_CONFIG } from '@core/types';

/**
 * InputManager handles keyboard input using the Command Pattern.
 * Supports key buffering, DAS (Delayed Auto Shift), and ARR (Auto Repeat Rate).
 *
 * @see ARCHITECTURE.md for input handling design
 */
export class InputManager {
  private keyBindings: Map<string, InputCommand> = new Map();
  private pressedKeys: Set<string> = new Set();
  private keyTimers: Map<string, number> = new Map();
  private boundHandleKeyDown: (event: KeyboardEvent) => void;
  private boundHandleKeyUp: (event: KeyboardEvent) => void;

  // DAS/ARR configuration
  private readonly dasDelay = GAME_CONFIG.DAS_DELAY;
  private readonly arrDelay = GAME_CONFIG.ARR_DELAY;

  constructor() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    this.setupEventListeners();
  }

  /**
   * Set up keyboard event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('keydown', this.boundHandleKeyDown);
    window.addEventListener('keyup', this.boundHandleKeyUp);
  }

  /**
   * Handle key down event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (this.keyBindings.has(event.key)) {
      event.preventDefault();
    }

    if (!this.pressedKeys.has(event.key)) {
      this.pressedKeys.add(event.key);
      this.keyTimers.set(event.key, 0);
    }
  }

  /**
   * Handle key up event
   */
  private handleKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.delete(event.key);
    this.keyTimers.delete(event.key);
  }

  /**
   * Bind a key to a command
   *
   * @param key - The key to bind
   * @param command - The command to execute
   */
  public bindKey(key: string, command: InputCommand): void {
    this.keyBindings.set(key, command);
  }

  /**
   * Update input state and execute commands
   *
   * @param deltaTime - Time since last update (ms)
   * @param gameState - Current game state
   * @returns Updated game state
   */
  public update(deltaTime: number, gameState: GameState): GameState {
    let newState = gameState;

    for (const key of this.pressedKeys) {
      const timer = this.keyTimers.get(key) ?? 0;
      const command = this.keyBindings.get(key);

      if (!command) continue;

      // Initial press or repeat after DAS+ARR
      const isInitialPress = timer === 0;
      const isDAS = timer >= this.dasDelay;

      let shouldExecute = isInitialPress;

      if (isDAS) {
        const timeSinceDAS = timer - this.dasDelay;
        // Check if we crossed an ARR boundary in this frame
        const previousTimeSinceDAS = timeSinceDAS - deltaTime;

        // Simple ARR implementation: execute every frame if ARR is small, or accumulate
        // For precise ARR:
        const previousSteps = Math.floor(Math.max(0, previousTimeSinceDAS) / this.arrDelay);
        const currentSteps = Math.floor(timeSinceDAS / this.arrDelay);

        if (currentSteps > previousSteps) {
          shouldExecute = true;
        }
      }

      if (shouldExecute) {
        newState = command.execute(newState);
      }

      this.keyTimers.set(key, timer + deltaTime);
    }

    return newState;
  }

  /**
   * Clear all input state
   */
  public clear(): void {
    this.pressedKeys.clear();
    this.keyTimers.clear();
  }

  /**
   * Remove event listeners (cleanup)
   */
  public destroy(): void {
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    window.removeEventListener('keyup', this.boundHandleKeyUp);
    this.clear();
  }
}
