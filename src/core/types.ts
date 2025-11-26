/**
 * Core type definitions for the Tetris game.
 * This file contains all shared interfaces, types, and enums.
 */

/**
 * Tetromino types (7 standard pieces)
 */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/**
 * Cell types for the board grid
 * 0 = empty, 1-7 = locked pieces, 8 = ghost piece
 */
export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Game status states
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

/**
 * Rotation direction
 */
export type RotationDirection = 'CW' | 'CCW';

/**
 * Position on the board
 */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/**
 * Tetromino piece definition
 */
export interface Tetromino {
  readonly type: TetrominoType;
  readonly shape: ReadonlyArray<ReadonlyArray<number>>;
  readonly color: string;
  readonly rotationState: number; // 0-3
}

/**
 * Game state interface
 * TODO: Implement state management with immutable updates
 */
export interface GameState {
  readonly board: CellType[][];
  readonly currentPiece: Tetromino | null;
  readonly currentPosition: Position;
  readonly nextPiece: Tetromino;
  readonly heldPiece: Tetromino | null;
  readonly canHold: boolean;
  readonly score: number;
  readonly level: number;
  readonly lines: number;
  readonly gameStatus: GameStatus;
  readonly lockRequested?: boolean;
  readonly lastSpawnTime?: number;
}

/**
 * Input command interface (Command Pattern)
 * TODO: Implement specific commands for each input action
 */
export interface InputCommand {
  execute(gameState: GameState): GameState;
}

/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  // Board dimensions
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  VISIBLE_HEIGHT: 20,

  // Spawn position
  // TODO: CODE_SMELL - Added to eliminate magic numbers in spawn logic
  SPAWN_POSITION_X: 3,
  SPAWN_POSITION_Y: 0,

  // Timing (milliseconds)
  LOCK_DELAY: 500,
  LINE_CLEAR_DELAY: 300,
  DAS_DELAY: 133, // Delayed Auto Shift
  ARR_DELAY: 33, // Auto Repeat Rate
  SPAWN_DELAY: 200, // Debounce delay after spawn

  // Scoring
  SCORE_SINGLE: 100,
  SCORE_DOUBLE: 300,
  SCORE_TRIPLE: 500,
  SCORE_TETRIS: 800,
  SOFT_DROP_POINTS: 1,
  HARD_DROP_POINTS: 2,

  // Level progression
  LINES_PER_LEVEL: 10,
  MAX_LEVEL: 29,

  // Rendering
  CELL_SIZE: 30,
  BORDER_WIDTH: 2,
} as const;

/**
 * Tetromino color mapping
 */
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
} as const;

/**
 * Game events for event-driven architecture
 * TODO: Implement EventBus for cross-module communication
 */
export enum GameEvent {
  PIECE_SPAWNED = 'piece:spawned',
  PIECE_MOVED = 'piece:moved',
  PIECE_ROTATED = 'piece:rotated',
  PIECE_LOCKED = 'piece:locked',
  LINE_CLEARED = 'line:cleared',
  LEVEL_UP = 'level:up',
  GAME_OVER = 'game:over',
  GAME_PAUSED = 'game:paused',
  GAME_RESUMED = 'game:resumed',
}
