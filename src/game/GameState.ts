import type { GameState, GameStatus, Position } from '@core/types';
import { GAME_CONFIG } from '@core/types';
import { Board } from './Board';
import { PieceGenerator } from './Tetromino';

/**
 * GameStateManager manages the game state using immutable updates.
 * Implements state transitions and game logic.
 *
 * TODO: Implement the following:
 * - State initialization
 * - State update methods (move, rotate, drop)
 * - Score calculation
 * - Level progression
 * - Game over detection
 *
 * @see ARCHITECTURE.md for state management design
 */
export class GameStateManager {
  private state: GameState;
  private pieceGenerator: PieceGenerator;

  constructor() {
    this.pieceGenerator = new PieceGenerator();
    this.state = this.createInitialState();
  }

  /**
   * Create initial game state
   * TODO: Implement proper initialization
   */
  private createInitialState(): GameState {
    const board = new Board();
    const nextPiece = this.pieceGenerator.next();

    return {
      board: board.getGrid() as any, // TODO: Fix type
      currentPiece: null,
      currentPosition: { x: 3, y: 0 },
      nextPiece,
      heldPiece: null,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      gameStatus: 'idle',
    };
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return this.state;
  }

  /**
   * Start a new game
   * TODO: Implement game start logic
   */
  public startGame(): void {
    this.state = {
      ...this.createInitialState(),
      gameStatus: 'playing',
    };
    this.spawnPiece();
  }

  /**
   * Spawn a new piece
   * TODO: Implement piece spawning with game over check
   */
  private spawnPiece(): void {
    // TODO: Check if spawn position is valid
    // TODO: If not valid, trigger game over
    // TODO: Otherwise, spawn piece and get next piece
    // TODO: CODE_SMELL - Magic numbers: spawn position { x: 3, y: 0 } should be GAME_CONFIG constant

    const currentPiece = this.state.nextPiece;
    const nextPiece = this.pieceGenerator.next();

    // TODO: CODE_SMELL - Inconsistent state management: use setState() method instead of direct mutation
    this.state = {
      ...this.state,
      currentPiece,
      currentPosition: { x: 3, y: 0 },
      nextPiece,
      canHold: true,
    };
  }

  /**
   * Move current piece
   * TODO: Implement movement with collision detection
   *
   * @param dx - Horizontal movement (-1 = left, 1 = right)
   * @param dy - Vertical movement (1 = down)
   */
  public movePiece(dx: number, dy: number): void {
    if (!this.state.currentPiece || this.state.gameStatus !== 'playing') {
      return;
    }

    const newPosition: Position = {
      x: this.state.currentPosition.x + dx,
      y: this.state.currentPosition.y + dy,
    };

    // TODO: Check collision with Board.canPlacePiece()
    // TODO: If valid, update position
    // TODO: If moving down and collision, lock piece

    this.state = {
      ...this.state,
      currentPosition: newPosition,
    };
  }

  /**
   * Rotate current piece
   * TODO: Implement rotation with SRS wall kicks
   *
   * @param direction - Rotation direction
   */
  public rotatePiece(direction: 'CW' | 'CCW'): void {
    if (!this.state.currentPiece || this.state.gameStatus !== 'playing') {
      return;
    }

    // TODO: Attempt rotation with wall kick tests
    // TODO: Update piece if successful
  }

  /**
   * Hard drop current piece
   * TODO: Implement hard drop with scoring
   */
  public hardDrop(): void {
    if (!this.state.currentPiece || this.state.gameStatus !== 'playing') {
      return;
    }

    // TODO: Calculate drop distance
    // TODO: Update score (HARD_DROP_POINTS × distance)
    // TODO: Lock piece immediately
  }

  /**
   * Lock current piece to board
   * TODO: Implement piece locking and line clearing
   */
  private lockPiece(): void {
    if (!this.state.currentPiece) return;

    // TODO: Lock piece to board using Board.lockPiece()
    // TODO: Clear lines using Board.clearLines()
    // TODO: Update score based on lines cleared
    // TODO: Update level if needed
    // TODO: Spawn next piece
  }

  /**
   * Calculate score for line clears
   * TODO: Implement scoring system from GAME_DESIGN.md
   *
   * @param linesCleared - Number of lines cleared
   * @returns Points earned
   */
  private calculateScore(linesCleared: number): number {
    const { level } = this.state;

    switch (linesCleared) {
      case 1:
        return GAME_CONFIG.SCORE_SINGLE * level;
      case 2:
        return GAME_CONFIG.SCORE_DOUBLE * level;
      case 3:
        return GAME_CONFIG.SCORE_TRIPLE * level;
      case 4:
        return GAME_CONFIG.SCORE_TETRIS * level;
      default:
        return 0;
    }
  }

  /**
   * Calculate level based on lines cleared
   * TODO: Implement level progression
   *
   * @param totalLines - Total lines cleared
   * @returns Current level
   */
  private calculateLevel(totalLines: number): number {
    return Math.floor(totalLines / GAME_CONFIG.LINES_PER_LEVEL) + 1;
  }

  /**
   * Pause the game
   * TODO: Implement pause logic
   */
  public pause(): void {
    if (this.state.gameStatus === 'playing') {
      // TODO: CODE_SMELL - Inconsistent state management: use setState() method instead of direct mutation
      this.state = {
        ...this.state,
        gameStatus: 'paused',
      };
    }
  }

  /**
   * Resume the game
   * TODO: Implement resume logic
   */
  public resume(): void {
    if (this.state.gameStatus === 'paused') {
      // TODO: CODE_SMELL - Inconsistent state management: use setState() method instead of direct mutation
      this.state = {
        ...this.state,
        gameStatus: 'playing',
      };
    }
  }

  /**
   * Reset the game
   * TODO: Implement game reset
   */
  public reset(): void {
    this.state = this.createInitialState();
  }
}
