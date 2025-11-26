import type { InputCommand, GameState } from '@core/types';

/**
 * InputManager handles keyboard input using the Command Pattern.
 * Supports key buffering, DAS (Delayed Auto Shift), and ARR (Auto Repeat Rate).
 *
 * TODO: Implement the following features:
 * - Key binding configuration
 * - DAS/ARR for smooth movement
 * - Input buffering for responsive controls
 * - Command execution
 *
 * @see ARCHITECTURE.md for input handling design
 */
export class InputManager {
  private keyBindings: Map<string, InputCommand> = new Map();
  private pressedKeys: Set<string> = new Set();
  private keyTimers: Map<string, number> = new Map();

  // DAS/ARR configuration
  private readonly dasDelay = 133; // Delayed Auto Shift (ms)
  private readonly arrDelay = 33; // Auto Repeat Rate (ms)

  /**
   * Initialize input manager and attach event listeners
   * TODO: Implement event listener setup
   */
  constructor() {
    this.setupEventListeners();
  }

  /**
   * Set up keyboard event listeners
   * TODO: Implement keydown/keyup handlers
   */
  private setupEventListeners(): void {
    // TODO: Add event listeners for keydown and keyup
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Handle key down event
   * TODO: Implement key press handling with buffering
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default browser behavior for game keys
    if (this.keyBindings.has(event.key)) {
      event.preventDefault();
    }

    // TODO: Add key to pressed keys set
    this.pressedKeys.add(event.key);

    // TODO: Initialize timer for DAS
    if (!this.keyTimers.has(event.key)) {
      this.keyTimers.set(event.key, 0);
    }
  }

  /**
   * Handle key up event
   * TODO: Implement key release handling
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // TODO: Remove key from pressed keys set
    this.pressedKeys.delete(event.key);
    this.keyTimers.delete(event.key);
  }

  /**
   * Bind a key to a command
   * TODO: Implement key binding system
   *
   * @param key - The key to bind
   * @param command - The command to execute
   */
  public bindKey(key: string, command: InputCommand): void {
    this.keyBindings.set(key, command);
  }

  /**
   * Update input state and execute commands
   * TODO: Implement DAS/ARR logic and command execution
   *
   * @param deltaTime - Time since last update (ms)
   * @param gameState - Current game state
   * @returns Updated game state
   */
  public update(deltaTime: number, gameState: GameState): GameState {
    let newState = gameState;

    // TODO: Process pressed keys with DAS/ARR
    for (const key of this.pressedKeys) {
      const timer = this.keyTimers.get(key) ?? 0;
      const command = this.keyBindings.get(key);

      if (!command) continue;

      // Initial press or repeat after DAS+ARR
      // TODO: Implement proper DAS/ARR timing logic
      const shouldExecute =
        timer === 0 || // Initial press
        (timer >= this.dasDelay && (timer - this.dasDelay) % this.arrDelay === 0); // Repeat

      if (shouldExecute) {
        newState = command.execute(newState);
      }

      this.keyTimers.set(key, timer + deltaTime);
    }

    return newState;
  }

  /**
   * Clear all input state
   * TODO: Implement cleanup logic
   */
  public clear(): void {
    this.pressedKeys.clear();
    this.keyTimers.clear();
  }

  /**
   * Remove event listeners (cleanup)
   * TODO: Implement cleanup
   */
  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.clear();
  }
}
