import './style.css';
import { GameLoop } from '@engine/GameLoop';
import { InputManager } from '@engine/InputManager';
import { GameStateManager } from '@game/GameState';
import { GAME_CONFIG } from '@core/types';

/**
 * Main application entry point.
 * Initializes the game, sets up the canvas, and starts the game loop.
 *
 * TODO: Implement the following:
 * - Canvas setup and sizing
 * - Game initialization
 * - Renderer creation
 * - Input binding
 * - Game loop start
 */

/**
 * Initialize the canvas element
 * TODO: Create and configure canvas
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

  // TODO: Add UI canvas for score, next piece, etc.

  return canvas;
}

/**
 * Main game initialization
 * TODO: Wire up all game systems
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
  const gameState = new GameStateManager();
  const gameLoop = new GameLoop();
  const inputManager = new InputManager();

  // TODO: Create Renderer instance
  // const renderer = new Renderer(ctx);

  // Set up game loop callbacks
  gameLoop.setUpdateCallback((deltaTime: number) => {
    // TODO: Update game state
    // const state = gameState.getState();
    // const newState = inputManager.update(deltaTime, state);
    // gameState.update(newState);

    console.log('Update:', deltaTime);
  });

  gameLoop.setRenderCallback((interpolation: number) => {
    // TODO: Render game state
    // const state = gameState.getState();
    // renderer.render(state, interpolation);

    // Placeholder rendering
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Tetris Game', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + 30);
  });

  // TODO: Bind input keys
  // inputManager.bindKey('ArrowLeft', new MoveLeftCommand());
  // inputManager.bindKey('ArrowRight', new MoveRightCommand());
  // inputManager.bindKey('ArrowDown', new SoftDropCommand());
  // inputManager.bindKey(' ', new HardDropCommand());
  // inputManager.bindKey('ArrowUp', new RotateCommand('CW'));
  // inputManager.bindKey('z', new RotateCommand('CCW'));

  // Start game loop
  gameLoop.start();

  console.log('✅ Game initialized successfully');
  console.log('📚 See docs/ for architecture and development guides');
  console.log('🤖 See docs/LLM_WORKFLOW.md for AI-assisted development tips');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
