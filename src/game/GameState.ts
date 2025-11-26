import type { GameState, Position, CellType } from '@core/types';
import { GAME_CONFIG } from '@core/types';
import { Board } from './Board';
import { PieceGenerator } from './Tetromino';
import { calculateDropSpeed } from '@utils/helpers';

/**
 * GameStateManager manages the game state using immutable updates.
 * Implements state transitions and game logic.
 *
 * @see ARCHITECTURE.md for state management design
 */
export class GameStateManager {
  private state: GameState;
  private pieceGenerator: PieceGenerator;
  private gravityAccumulator = 0;

  constructor() {
    this.pieceGenerator = new PieceGenerator();
    this.state = this.createInitialState();
  }

  /**
   * Create initial game state
   */
  private createInitialState(): GameState {
    const board = new Board();
    const nextPiece = this.pieceGenerator.next();

    return {
      board: board.getGrid() as unknown as CellType[][], // Cast to match CellType[][]
      currentPiece: null,
      currentPosition: { x: GAME_CONFIG.SPAWN_POSITION_X, y: GAME_CONFIG.SPAWN_POSITION_Y },
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
   * Set the game state (used by InputManager)
   */
  public setState(newState: GameState): void {
    this.state = newState;
  }

  /**
   * Start a new game
   */
  public startGame(): void {
    this.state = {
      ...this.createInitialState(),
      gameStatus: 'playing',
    };
    this.spawnPiece();
  }

  /**
   * Update game state (called by GameLoop)
   * Handles gravity and locking
   */
  public update(deltaTime: number): void {
    if (this.state.gameStatus !== 'playing') return;

    // Check for lock request (e.g. from Hard Drop)
    if (this.state.lockRequested) {
      this.lockPiece();
      // Remove lock request flag
      this.state = { ...this.state, lockRequested: undefined };
      return;
    }

    // Handle gravity
    const dropSpeed = calculateDropSpeed(this.state.level);
    this.gravityAccumulator += deltaTime;

    if (this.gravityAccumulator >= dropSpeed) {
      this.gravityAccumulator -= dropSpeed;
      this.applyGravity();
    }
  }

  /**
   * Apply gravity (move piece down)
   */
  private applyGravity(): void {
    if (!this.state.currentPiece) return;

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, this.state.board);

    const newPosition: Position = {
      x: this.state.currentPosition.x,
      y: this.state.currentPosition.y + 1,
    };

    if (board.canPlacePiece(this.state.currentPiece, newPosition)) {
      this.state = {
        ...this.state,
        currentPosition: newPosition,
      };
    } else {
      // Lock piece if it can't move down
      this.lockPiece();
    }
  }

  /**
   * Spawn a new piece
   */
  private spawnPiece(): void {
    const currentPiece = this.state.nextPiece;
    const nextPiece = this.pieceGenerator.next();
    const spawnPosition = { x: GAME_CONFIG.SPAWN_POSITION_X, y: GAME_CONFIG.SPAWN_POSITION_Y };

    // Check for Game Over (collision at spawn)
    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, this.state.board);

    // Create a temporary piece to check collision
    const tempPiece = { ...currentPiece, rotationState: 0 };

    if (!board.canPlacePiece(tempPiece, spawnPosition)) {
      this.state = {
        ...this.state,
        gameStatus: 'gameOver',
      };
      return;
    }

    this.state = {
      ...this.state,
      currentPiece,
      currentPosition: spawnPosition,
      nextPiece,
      canHold: true,
      lastSpawnTime: Date.now(),
    };
  }

  /**
   * Lock current piece to board
   */
  private lockPiece(): void {
    if (!this.state.currentPiece) return;

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, this.state.board);

    // Lock piece
    board.lockPiece(this.state.currentPiece, this.state.currentPosition);

    // Clear lines
    const linesCleared = board.clearLines();

    // Calculate score and level
    const points = this.calculateScore(linesCleared);
    const newLines = this.state.lines + linesCleared;
    const newLevel = this.calculateLevel(newLines);

    this.state = {
      ...this.state,
      board: board.getGrid() as unknown as CellType[][],
      currentPiece: null,
      score: this.state.score + points,
      lines: newLines,
      level: newLevel,
    };

    this.spawnPiece();
  }

  /**
   * Calculate score for line clears
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
   *
   * @param totalLines - Total lines cleared
   * @returns Current level
   */
  private calculateLevel(totalLines: number): number {
    const level = Math.floor(totalLines / GAME_CONFIG.LINES_PER_LEVEL) + 1;
    return Math.min(level, GAME_CONFIG.MAX_LEVEL);
  }

  /**
   * Pause the game
   */
  public pause(): void {
    if (this.state.gameStatus === 'playing') {
      this.state = {
        ...this.state,
        gameStatus: 'paused',
      };
    }
  }

  /**
   * Resume the game
   */
  public resume(): void {
    if (this.state.gameStatus === 'paused') {
      this.state = {
        ...this.state,
        gameStatus: 'playing',
      };
    }
  }

  /**
   * Reset the game
   */
  public reset(): void {
    this.state = this.createInitialState();
    this.gravityAccumulator = 0;
    this.pieceGenerator = new PieceGenerator(); // Reset bag
  }
}
