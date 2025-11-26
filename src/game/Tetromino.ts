import type { Tetromino, TetrominoType, RotationDirection } from '@core/types';
import { TETROMINO_COLORS } from '@core/types';

/**
 * Tetromino shape definitions for all 7 pieces.
 * Each piece has 4 rotation states (or fewer for symmetric pieces).
 *
 * TODO: Implement the following:
 * - Rotation logic with SRS wall kicks
 * - Piece factory for creating new pieces
 * - Rotation state management
 *
 * @see ARCHITECTURE.md for tetromino structure
 * @see GAME_DESIGN.md for piece specifications
 */

/**
 * Tetromino shape definitions
 * Each shape is a 4x4 matrix (or 2x2 for O-piece)
 */
const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    // 0°
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // 90°
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    // 180°
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    // 270°
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    // O-piece doesn't rotate
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    // 0°
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // 180°
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    // 270°
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    // 0°
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  ],
  Z: [
    // 0°
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
  ],
  J: [
    // 0°
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    // 180°
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    // 270°
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    // 0°
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    // 180°
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    // 270°
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

/**
 * Create a new tetromino of the specified type
 * TODO: Implement piece creation
 *
 * @param type - The type of tetromino to create
 * @returns A new Tetromino instance
 */
export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type]![0]!,
    color: TETROMINO_COLORS[type],
    rotationState: 0,
  };
}

/**
 * Rotate a tetromino
 * TODO: Implement SRS rotation with wall kicks
 *
 * @param piece - The tetromino to rotate
 * @param direction - Rotation direction (CW or CCW)
 * @returns New rotated tetromino
 */
export function rotateTetromino(piece: Tetromino, direction: RotationDirection): Tetromino {
  // O-piece doesn't rotate
  if (piece.type === 'O') {
    return piece;
  }

  const shapes = TETROMINO_SHAPES[piece.type]!;
  const numRotations = shapes.length;

  // Calculate new rotation state
  let newRotationState: number;
  if (direction === 'CW') {
    newRotationState = (piece.rotationState + 1) % numRotations;
  } else {
    newRotationState = (piece.rotationState - 1 + numRotations) % numRotations;
  }

  // TODO: Add SRS wall kick logic here
  return {
    ...piece,
    shape: shapes[newRotationState]!,
    rotationState: newRotationState,
  };
}

/**
 * Get SRS wall kick offsets for a rotation
 * TODO: Implement SRS wall kick tables
 *
 * @param piece - The tetromino being rotated
 * @param fromRotation - Starting rotation state
 * @param toRotation - Target rotation state
 * @returns Array of [x, y] offset pairs to test
 */
export function getWallKickOffsets(
  piece: Tetromino,
  fromRotation: number,
  toRotation: number
): Array<[number, number]> {
  // TODO: Implement proper SRS wall kick tables
  // Different tables for I-piece vs other pieces
  // See: https://tetris.wiki/Super_Rotation_System

  // Placeholder: basic offset tests
  return [
    [0, 0], // No offset
    [-1, 0], // Left
    [1, 0], // Right
    [0, -1], // Up
    [-1, -1], // Left + Up
  ];
}

/**
 * 7-Bag randomizer for fair piece distribution
 * TODO: Implement 7-bag randomizer
 *
 * @see GAME_DESIGN.md for piece generation rules
 */
export class PieceGenerator {
  private bag: TetrominoType[] = [];
  private readonly allPieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  /**
   * Get the next piece from the bag
   * TODO: Implement bag refill and shuffle logic
   */
  public next(): Tetromino {
    if (this.bag.length === 0) {
      this.refillBag();
    }

    const type = this.bag.pop()!;
    return createTetromino(type);
  }

  /**
   * Refill and shuffle the bag
   * TODO: Implement Fisher-Yates shuffle
   */
  private refillBag(): void {
    this.bag = [...this.allPieces];
    this.shuffle();
  }

  /**
   * Shuffle the bag using Fisher-Yates algorithm
   * TODO: Implement proper shuffle
   */
  private shuffle(): void {
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j]!, this.bag[i]!];
    }
  }

  /**
   * Peek at the next piece without removing it
   * TODO: Implement peek functionality
   */
  public peek(): Tetromino {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return createTetromino(this.bag[this.bag.length - 1]!);
  }
}
