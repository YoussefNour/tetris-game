import { describe, it, expect } from 'vitest';
import { createTetromino, rotateTetromino, PieceGenerator } from '../src/game/Tetromino';

/**
 * Tetromino tests
 * TODO: Add comprehensive rotation and wall kick tests
 */
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

      // Rotate 4 times clockwise should return to original
      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');
      piece = rotateTetromino(piece, 'CW');

      expect(piece.rotationState).toBe(0);
    });

    // TODO: Add SRS wall kick tests
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

      // Generate 7 pieces
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

    // TODO: Add randomization distribution tests
  });
});
