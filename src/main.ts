import './style.css';
import { GameLoop } from '@engine/GameLoop';
import { InputManager } from '@engine/InputManager';
import { GameStateManager } from '@game/GameState';
import { GAME_CONFIG } from '@core/types';
import type { GameStatistics } from '@core/types';
import {
  MoveCommand,
  RotateCommand,
  SoftDropCommand,
  HardDropCommand,
} from '@game/Commands';
import { formatScore } from '@utils/helpers';

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

  const scoreDisplay = document.getElementById('score');
  const levelDisplay = document.getElementById('level');
  const linesDisplay = document.getElementById('lines');
  const pauseOverlay = document.getElementById('pause-overlay');

  const updatePauseOverlay = (): void => {
    if (!pauseOverlay) return;
    const statePaused = gameStateManager.getState().gameStatus === 'paused';
    const loopPaused = gameLoop.isPaused;
    const shouldShow = statePaused || loopPaused;
    pauseOverlay.classList.toggle('visible', shouldShow);
    pauseOverlay.setAttribute('aria-hidden', (!shouldShow).toString());
  };

  const updateStatsDisplay = (stats: GameStatistics): void => {
    if (scoreDisplay) {
      scoreDisplay.textContent = formatScore(stats.score);
    }
    if (levelDisplay) {
      levelDisplay.textContent = stats.level.toString();
    }
    if (linesDisplay) {
      linesDisplay.textContent = stats.lines.toString();
    }
  };

  gameLoop.setStatsCallback(updateStatsDisplay);
  updateStatsDisplay(gameStateManager.getStatistics());

  // Bind input keys
  inputManager.bindKey('ArrowLeft', new MoveCommand(-1, 0));
  inputManager.bindKey('ArrowRight', new MoveCommand(1, 0));
  inputManager.bindKey('ArrowDown', new SoftDropCommand());
  inputManager.bindKey(' ', new HardDropCommand());
  inputManager.bindKey('ArrowUp', new RotateCommand('CW'));
  inputManager.bindKey('z', new RotateCommand('CCW'));

  // Set up game loop callbacks
  gameLoop.setUpdateCallback((deltaTime: number) => {
    // 1. Get current state
    let state = gameStateManager.getState();

    // 2. Process input
    state = inputManager.update(deltaTime, state);
    gameStateManager.setState(state);

    // 3. Update game logic (gravity, etc.)
    gameStateManager.update(deltaTime);

    return gameStateManager.getStatistics();
  });

  gameLoop.setRenderCallback((_interpolation: number) => {
    const state = gameStateManager.getState();
    const cellSize = GAME_CONFIG.CELL_SIZE;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#030017');
    bgGradient.addColorStop(1, '#1c0941');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Backdrop grid
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    for (let x = 0; x <= GAME_CONFIG.BOARD_WIDTH; x++) {
      const posX = x * cellSize;
      ctx.moveTo(posX, 0);
      ctx.lineTo(posX, canvas.height);
    }
    for (let y = 0; y <= GAME_CONFIG.BOARD_HEIGHT; y++) {
      const posY = y * cellSize;
      ctx.moveTo(0, posY);
      ctx.lineTo(canvas.width, posY);
    }
    ctx.stroke();

    // Render Board cells with neon glow
    const neonPalette = ['#ff5ef0', '#34f7ff', '#ffd700', '#ff6b6b', '#a45dff', '#3ef2a1', '#ffb0ff'];
    state.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const color = neonPalette[(cell - 1) % neonPalette.length] ?? neonPalette[0];
          ctx.save();
          ctx.fillStyle = color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = color;
          ctx.fillRect(
            x * cellSize + 1,
            y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
          ctx.restore();
        }
      });
    });

    // Render Current Piece
    if (state.currentPiece) {
      const shape = state.currentPiece.shape;
      const glowColor = state.currentPiece.color;
      shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            const x = (state.currentPosition.x + c) * cellSize;
            const y = (state.currentPosition.y + r) * cellSize;
            ctx.save();
            ctx.fillStyle = glowColor;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 18;
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            ctx.restore();
          }
        });
      });
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

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
      updatePauseOverlay();
    }
    if (e.key === 'r' || e.key === 'R') {
      if (gameStateManager.getState().gameStatus === 'gameOver') {
        gameStateManager.reset();
        gameStateManager.startGame();
        updatePauseOverlay();
      }
    }
    if (e.key === 'p' || e.key === 'P') {
      const status = gameStateManager.getState().gameStatus;
      if (status === 'playing') gameStateManager.pause();
      else if (status === 'paused') gameStateManager.resume();
      updatePauseOverlay();
    }
    if (e.key === 'Escape') {
      setTimeout(updatePauseOverlay, 0);
    }
  });

  // Start game loop
  gameLoop.start();
  updatePauseOverlay();

  console.log('✅ Game initialized successfully');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
