import type { Tetromino, TetrominoType, RotationDirection } from '@core/types';
import { TETROMINO_COLORS } from '@core/types';

/**
 * Tetromino shape definitions for all 7 pieces.
 * Each piece has 4 rotation states (or fewer for symmetric pieces).
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
 *
 * @param type - The type of tetromino to create
 * @returns A new Tetromino instance
 */
export function createTetromino(type: TetrominoType): Tetromino {
  const shapes = TETROMINO_SHAPES[type];
  if (!shapes || !shapes[0]) {
    throw new Error(`Invalid tetromino type or missing initial shape for type: ${type}`);
  }
  return {
    type,
    shape: shapes[0],
    color: TETROMINO_COLORS[type],
    rotationState: 0,
  };
}

/**
 * Rotate a tetromino based on the current rotation states
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

  const shapes = TETROMINO_SHAPES[piece.type];
  if (!shapes) {
    throw new Error(`Invalid tetromino type: ${piece.type}`);
  }
  const numRotations = shapes.length;

  // Calculate new rotation state
  let newRotationState: number;
  if (direction === 'CW') {
    newRotationState = (piece.rotationState + 1) % numRotations;
  } else {
    newRotationState = (piece.rotationState - 1 + numRotations) % numRotations;
  }

  const newShape = shapes[newRotationState];
  if (!newShape) {
    throw new Error(
      `Invalid rotation state: ${newRotationState} for tetromino type: ${piece.type}`
    );
  }

  return {
    ...piece,
    shape: newShape,
    rotationState: newRotationState,
  };
}

/**
 * Get SRS wall kick offsets for a rotation
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
  // JLSTZ Wall Kicks
  const JLSTZ_KICKS: Record<string, [number, number][]> = {
    '0-1': [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    '1-0': [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    '1-2': [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    '2-1': [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    '2-3': [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
    '3-2': [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    '3-0': [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    '0-3': [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
  };

  // I Wall Kicks
  const I_KICKS: Record<string, [number, number][]> = {
    '0-1': [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
    '1-0': [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    '1-2': [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
    '2-1': [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    '2-3': [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    '3-2': [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
    '3-0': [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    '0-3': [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
  };

  const key = `${fromRotation}-${toRotation}`;

  if (piece.type === 'I') {
    return I_KICKS[key] || [[0, 0]];
  } else if (piece.type === 'O') {
    return [[0, 0]];
  } else {
    return JLSTZ_KICKS[key] || [[0, 0]];
  }
}

/**
 * 7-Bag randomizer for fair piece distribution
 *
 * @see GAME_DESIGN.md for piece generation rules
 */
export class PieceGenerator {
  private bag: TetrominoType[] = [];
  private readonly allPieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  /**
   * Get the next piece from the bag
   */
  public next(): Tetromino {
    if (this.bag.length === 0) {
      this.refillBag();
    }

    const type = this.bag.pop();
    if (!type) throw new Error('Bag is empty after refill');
    return createTetromino(type);
  }

  /**
   * Refill and shuffle the bag
   */
  private refillBag(): void {
    this.bag = [...this.allPieces];
    this.shuffle();
  }

  /**
   * Shuffle the bag using Fisher-Yates algorithm
   */
  private shuffle(): void {
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.bag[i];
      const swap = this.bag[j];
      if (temp && swap) {
        this.bag[i] = swap;
        this.bag[j] = temp;
      }
    }
  }

  /**
   * Peek at the next piece without removing it
   */
  public peek(): Tetromino {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    const type = this.bag[this.bag.length - 1];
    if (!type) throw new Error('Bag is empty after refill');
    return createTetromino(type);
  }
}
