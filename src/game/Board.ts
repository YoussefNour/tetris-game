import type { CellType, Tetromino, Position } from '@core/types';
import { GAME_CONFIG } from '@core/types';

/**
 * Board manages the game grid and piece placement.
 * Handles collision detection, line clearing, and board state.
 *
 * TODO: Implement the following methods:
 * - canPlacePiece(): Collision detection
 * - lockPiece(): Lock piece to board
 * - clearLines(): Detect and clear completed lines
 * - getCell(): Get cell value at position
 * - setCell(): Set cell value at position
 *
 * @see ARCHITECTURE.md for board system design
 * @see GAME_DESIGN.md for line clearing rules
 */
export class Board {
  private grid: CellType[][];
  public readonly width: number;
  public readonly height: number;

  constructor(
    width: number = GAME_CONFIG.BOARD_WIDTH,
    height: number = GAME_CONFIG.BOARD_HEIGHT
  ) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
  }

  /**
   * Create an empty grid
   * TODO: Initialize grid with empty cells
   */
  private createEmptyGrid(): CellType[][] {
    const grid: CellType[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y]![x] = 0;
      }
    }
    return grid;
  }

  /**
   * Get cell value at position
   * TODO: Implement bounds checking
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Cell value or undefined if out of bounds
   */
  public getCell(x: number, y: number): CellType | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.grid[y]?.[x];
  }

  /**
   * Set cell value at position
   * TODO: Implement bounds checking and validation
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param value - Cell value to set
   */
  public setCell(x: number, y: number, value: CellType): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    if (this.grid[y]) {
      this.grid[y]![x] = value;
    }
  }

  /**
   * Check if a piece can be placed at the given position
   * TODO: Implement SRS collision detection
   *
   * @param piece - The tetromino to check
   * @param position - The position to check
   * @returns True if piece can be placed, false otherwise
   */
  public canPlacePiece(piece: Tetromino, position: Position): boolean {
    const shape = piece.shape;

    // TODO: Iterate through piece shape and check each cell
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row]!.length; col++) {
        if (shape[row]![col] !== 0) {
          const boardX = position.x + col;
          const boardY = position.y + row;

          // Check bounds
          if (boardX < 0 || boardX >= this.width || boardY >= this.height) {
            return false;
          }

          // Check cell occupation (allow negative Y for spawn)
          if (boardY >= 0) {
            const cell = this.getCell(boardX, boardY);
            if (cell !== 0 && cell !== undefined) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  /**
   * Lock a piece to the board
   * TODO: Implement piece locking logic
   *
   * @param piece - The tetromino to lock
   * @param position - The position to lock at
   */
  public lockPiece(piece: Tetromino, position: Position): void {
    const shape = piece.shape;

    // TODO: Place piece cells on board
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row]!.length; col++) {
        if (shape[row]![col] !== 0) {
          const boardX = position.x + col;
          const boardY = position.y + row;

          if (boardY >= 0 && boardY < this.height) {
            this.setCell(boardX, boardY, shape[row]![col] as CellType);
          }
        }
      }
    }
  }

  /**
   * Clear completed lines and return count
   * TODO: Implement line detection and clearing
   *
   * @returns Number of lines cleared
   */
  public clearLines(): number {
    let linesCleared = 0;
    const linesToClear: number[] = [];

    // TODO: Detect completed lines
    for (let y = 0; y < this.height; y++) {
      let isComplete = true;
      for (let x = 0; x < this.width; x++) {
        if (this.getCell(x, y) === 0) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        linesToClear.push(y);
      }
    }

    // TODO: Remove completed lines and shift down
    for (const lineY of linesToClear.reverse()) {
      this.grid.splice(lineY, 1);
      this.grid.unshift(new Array(this.width).fill(0) as CellType[]);
      linesCleared++;
    }

    return linesCleared;
  }

  /**
   * Check if board is empty
   * TODO: Implement empty check
   */
  public isEmpty(): boolean {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getCell(x, y) !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Reset the board to empty state
   * TODO: Implement board reset
   */
  public reset(): void {
    this.grid = this.createEmptyGrid();
  }

  /**
   * Get a copy of the grid (for rendering)
   * TODO: Return immutable copy
   */
  public getGrid(): ReadonlyArray<ReadonlyArray<CellType>> {
    return this.grid;
  }
}
