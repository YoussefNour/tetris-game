import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '../src/game/Board';
import { createTetromino } from '../src/game/Tetromino';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('initialization', () => {
    it('should create empty grid', () => {
      expect(board.isEmpty()).toBe(true);
    });

    it('should have correct dimensions', () => {
      expect(board.width).toBe(10);
      expect(board.height).toBe(20);
    });
  });

  describe('getCell / setCell', () => {
    it('should get and set cell values', () => {
      board.setCell(5, 10, 1);
      expect(board.getCell(5, 10)).toBe(1);
    });

    it('should return undefined for out of bounds', () => {
      expect(board.getCell(-1, 0)).toBeUndefined();
      expect(board.getCell(0, -1)).toBeUndefined();
      expect(board.getCell(10, 0)).toBeUndefined();
      expect(board.getCell(0, 20)).toBeUndefined();
    });

    it('should not set out of bounds cells', () => {
      board.setCell(-1, 0, 1);
      board.setCell(10, 0, 1);
      expect(board.isEmpty()).toBe(true);
    });
  });

  describe('canPlacePiece', () => {
    it('should allow piece at spawn position', () => {
      const piece = createTetromino('I');
      const canPlace = board.canPlacePiece(piece, { x: 3, y: 0 });
      expect(canPlace).toBe(true);
    });

    it('should detect collision with board edges', () => {
      const piece = createTetromino('I');
      expect(board.canPlacePiece(piece, { x: -1, y: 0 })).toBe(false);
      expect(board.canPlacePiece(piece, { x: board.width, y: 0 })).toBe(false);
    });

    it('should detect collision with locked pieces', () => {
      board.setCell(3, 1, 1);
      const piece = createTetromino('O');
      expect(board.canPlacePiece(piece, { x: 3, y: 0 })).toBe(false);
    });
  });

  describe('lockPiece', () => {
    it('should lock piece to board', () => {
      const piece = createTetromino('O');
      board.lockPiece(piece, { x: 0, y: 0 });
      expect(board.isEmpty()).toBe(false);
      expect(board.getCell(0, 0)).toBe(1);
      expect(board.getCell(1, 0)).toBe(1);
      expect(board.getCell(0, 1)).toBe(1);
      expect(board.getCell(1, 1)).toBe(1);
    });
  });

  describe('clearLines', () => {
    it('should clear single completed line', () => {
      for (let x = 0; x < board.width; x++) {
        board.setCell(x, 19, 1);
      }

      const result = board.clearLines();
      expect(result.clearedLines).toBe(1);
      expect(result.clearedRows).toEqual([19]);
      expect(board.isEmpty()).toBe(true);
    });

    it('should clear multiple lines and report cleared rows', () => {
      for (let x = 0; x < board.width; x++) {
        board.setCell(x, 18, 1);
        board.setCell(x, 19, 1);
      }

      const result = board.clearLines();
      expect(result.clearedLines).toBe(2);
      expect(result.clearedRows).toEqual([18, 19]);

      expect(board.getCell(0, 0)).toBe(0);
      expect(board.isEmpty()).toBe(true);
    });

    it('should not clear incomplete lines', () => {
      for (let x = 0; x < board.width - 1; x++) {
        board.setCell(x, 19, 1);
      }

      const result = board.clearLines();
      expect(result.clearedLines).toBe(0);
      expect(result.clearedRows).toEqual([]);
    });
  });

  describe('grid helpers', () => {
    it('should return a defensive copy of the grid', () => {
      const cloned = board.getGrid();
      cloned[0][0] = 5;
      expect(board.getCell(0, 0)).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset board to empty state', () => {
      board.setCell(5, 10, 1);
      board.reset();
      expect(board.isEmpty()).toBe(true);
    });
  });
});
