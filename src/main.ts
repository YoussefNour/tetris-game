import './style.css';
import { GameLoop } from '@engine/GameLoop';
import { InputManager } from '@engine/InputManager';
import { GameStateManager } from '@game/GameState';
import { GAME_CONFIG } from '@core/types';
import {
  MoveCommand,
  RotateCommand,
  SoftDropCommand,
  HardDropCommand,
  HoldCommand,
} from '@game/Commands';

/**
 * Main application entry point.
 * Initializes the game, sets up the canvas, and starts the game loop.
 */

/**
 * Initialize the canvas element
 */
function initCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  // Set canvas size based on board dimensions
  const width = GAME_CONFIG.BOARD_WIDTH * GAME_CONFIG.CELL_SIZE;
  const height = GAME_CONFIG.BOARD_HEIGHT * GAME_CONFIG.CELL_SIZE;

  canvas.width = width;
  canvas.height = height;

  return canvas;
}

/**
 * Main game initialization
 */
function main(): void {
  console.log('🎮 Tetris Game Starting...');

  // Initialize canvas
  const canvas = initCanvas();
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D context');
  }

  // Initialize game systems
  const gameStateManager = new GameStateManager();
  const gameLoop = new GameLoop();
  const inputManager = new InputManager();

  // Bind input keys
  inputManager.bindKey('ArrowLeft', new MoveCommand(-1, 0));
  inputManager.bindKey('ArrowRight', new MoveCommand(1, 0));
  inputManager.bindKey('ArrowDown', new SoftDropCommand());
  inputManager.bindKey(' ', new HardDropCommand());
  inputManager.bindKey('ArrowUp', new RotateCommand('CW'));
  inputManager.bindKey('z', new RotateCommand('CCW'));
  inputManager.bindKey('c', new HoldCommand());

  // Set up game loop callbacks
  gameLoop.setUpdateCallback((deltaTime: number) => {
    // 1. Get current state
    let state = gameStateManager.getState();

    // 2. Process input
    state = inputManager.update(deltaTime, state);
    gameStateManager.setState(state);

    // 3. Update game logic (gravity, etc.)
    gameStateManager.update(deltaTime);
  });

  gameLoop.setRenderCallback((_interpolation: number) => {
    const state = gameStateManager.getState();

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Board
    const cellSize = GAME_CONFIG.CELL_SIZE;
    state.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          // TODO: Use proper colors based on cell value
          ctx.fillStyle = '#888';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
      });
    });

    // Render Current Piece
    if (state.currentPiece) {
      ctx.fillStyle = state.currentPiece.color;
      const shape = state.currentPiece.shape;
      shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            const x = (state.currentPosition.x + c) * cellSize;
            const y = (state.currentPosition.y + r) * cellSize;
            ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          }
        });
      });
    }

    // Render UI Overlay
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, 10, 20);
    ctx.fillText(`Level: ${state.level}`, 10, 40);
    ctx.fillText(`Lines: ${state.lines}`, 10, 60);

    if (state.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.font = '30px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.font = '20px monospace';
      ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 40);
    } else if (state.gameStatus === 'idle') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.font = '30px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TETRIS', canvas.width / 2, canvas.height / 2);
      ctx.font = '20px monospace';
      ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 40);
    }
  });

  // Handle global keys for game flow
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && gameStateManager.getState().gameStatus === 'idle') {
      gameStateManager.startGame();
    }
    if (e.key === 'r' || e.key === 'R') {
      if (gameStateManager.getState().gameStatus === 'gameOver') {
        gameStateManager.reset();
        gameStateManager.startGame();
      }
    }
    if (e.key === 'p' || e.key === 'P') {
      const status = gameStateManager.getState().gameStatus;
      if (status === 'playing') gameStateManager.pause();
      else if (status === 'paused') gameStateManager.resume();
    }
  });

  // Start game loop
  gameLoop.start();

  console.log('✅ Game initialized successfully');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
