import { describe, it, expect } from 'vitest';
import { TetrominoType } from '../src/core/types';
import {
  createTetromino,
  getWallKickOffsets,
  rotateTetromino,
  PieceGenerator,
} from '../src/game/Tetromino';

describe('Tetromino', () => {
  describe('createTetromino', () => {
    it('should create I-piece', () => {
      const piece = createTetromino('I');
      expect(piece.type).toBe('I');
      expect(piece.color).toBe('#00f0f0');
      expect(piece.rotationState).toBe(0);
      expect(piece.shape).toBeDefined();
    });

    it('should create all 7 piece types', () => {
      const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;
      types.forEach((type) => {
        const piece = createTetromino(type);
        expect(piece.type).toBe(type);
      });
    });

    it('should throw when type is invalid', () => {
      expect(() => createTetromino('X' as TetrominoType)).toThrow(
        'Invalid tetromino type or missing initial shape for type: X'
      );
    });
  });

  describe('rotateTetromino', () => {
    it('should rotate I-piece clockwise', () => {
      const piece = createTetromino('I');
      const rotated = rotateTetromino(piece, 'CW');
      expect(rotated.rotationState).toBe(1);
    });

    it('should rotate I-piece counter-clockwise', () => {
      const piece = createTetromino('I');
      const rotated = rotateTetromino(piece, 'CCW');
      expect(rotated.rotationState).toBe(3);
    });

    it('should not rotate O-piece', () => {
      const piece = createTetromino('O');
      const rotated = rotateTetromino(piece, 'CW');
      expect(rotated.rotationState).toBe(0);
      expect(rotated.shape).toEqual(piece.shape);
    });

    it('should cycle through rotation states', () => {
      let piece = createTetromino('T');

      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');

      expect(piece.rotationState).toBe(0);
    });

    it('should wrap around two-state pieces', () => {
      const piece = createTetromino('S');
      const rotated = rotateTetromino(piece, 'CW');
      expect(rotated.rotationState).toBe(1);
      expect(rotateTetromino(rotated, 'CW').rotationState).toBe(0);

      const counterClockwise = rotateTetromino(piece, 'CCW');
      expect(counterClockwise.rotationState).toBe(1);
    });
  });

  describe('getWallKickOffsets', () => {
    it('should return I piece offsets for a valid rotation pair', () => {
      const piece = createTetromino('I');
      expect(getWallKickOffsets(piece, 0, 1)).toEqual([
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, -1],
        [1, 2],
      ]);
    });

    it('should return JLSTZ offsets when a key exists', () => {
      const piece = createTetromino('T');
      expect(getWallKickOffsets(piece, 0, 1)).toEqual([
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ]);
    });

    it('should return fallback offsets when the key is missing', () => {
      const piece = createTetromino('J');
      expect(getWallKickOffsets(piece, 2, 0)).toEqual([[0, 0]]);
    });

    it('should always return zero offsets for the O-piece', () => {
      const piece = createTetromino('O');
      expect(getWallKickOffsets(piece, 0, 1)).toEqual([[0, 0]]);
      expect(getWallKickOffsets(piece, 1, 0)).toEqual([[0, 0]]);
    });
  });

  describe('PieceGenerator', () => {
    it('should generate pieces', () => {
      const generator = new PieceGenerator();
      const piece = generator.next();
      expect(piece).toBeDefined();
      expect(piece.type).toMatch(/[IOTSZJL]/);
    });

    it('should generate all 7 pieces in a bag', () => {
      const generator = new PieceGenerator();
      const pieces = new Set<string>();

      for (let i = 0; i < 7; i++) {
        pieces.add(generator.next().type);
      }

      expect(pieces.size).toBe(7);
    });

    it('should peek without removing piece', () => {
      const generator = new PieceGenerator();
      const peeked = generator.peek();
      const next = generator.next();
      expect(peeked.type).toBe(next.type);
    });

    it('should refill the bag when it becomes empty', () => {
      const generator = new PieceGenerator();
      for (let i = 0; i < 7; i++) {
        generator.next();
      }

      const secondBatch = [];
      for (let i = 0; i < 7; i++) {
        secondBatch.push(generator.next().type);
      }

      expect(new Set(secondBatch).size).toBe(7);
    });
  });
});
