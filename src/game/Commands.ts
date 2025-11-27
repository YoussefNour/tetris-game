import { InputCommand, GameState, GAME_CONFIG, Position, RotationDirection } from '@core/types';
import { Board } from './Board';
import { rotateTetromino, getWallKickOffsets } from './Tetromino';

function isCommandAllowed(gameState: GameState): boolean {
  if (gameState.lastSpawnTime && GAME_CONFIG.SPAWN_DELAY) {
    if (Date.now() - gameState.lastSpawnTime < GAME_CONFIG.SPAWN_DELAY) {
      return false;
    }
  }
  return true;
}

export class MoveCommand implements InputCommand {
  constructor(
    private dx: number,
    private dy: number
  ) {}

  execute(gameState: GameState): GameState {
    if (
      !gameState.currentPiece ||
      gameState.gameStatus !== 'playing' ||
      !isCommandAllowed(gameState)
    ) {
      return gameState;
    }

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, gameState.board);

    const newPosition: Position = {
      x: gameState.currentPosition.x + this.dx,
      y: gameState.currentPosition.y + this.dy,
    };

    if (board.canPlacePiece(gameState.currentPiece, newPosition)) {
      return {
        ...gameState,
        currentPosition: newPosition,
      };
    }

    return gameState;
  }
}

export class RotateCommand implements InputCommand {
  constructor(private direction: RotationDirection) {}

  execute(gameState: GameState): GameState {
    if (
      !gameState.currentPiece ||
      gameState.gameStatus !== 'playing' ||
      !isCommandAllowed(gameState)
    ) {
      return gameState;
    }

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, gameState.board);

    const rotatedPiece = rotateTetromino(gameState.currentPiece, this.direction);
    const kicks = getWallKickOffsets(
      gameState.currentPiece,
      gameState.currentPiece.rotationState,
      rotatedPiece.rotationState
    );

    for (const [offsetX, offsetY] of kicks) {
      const testPosition: Position = {
        x: gameState.currentPosition.x + offsetX,
        y: gameState.currentPosition.y - offsetY, // Y is inverted in SRS kicks (up is positive)
      };

      if (board.canPlacePiece(rotatedPiece, testPosition)) {
        return {
          ...gameState,
          currentPiece: rotatedPiece,
          currentPosition: testPosition,
        };
      }
    }

    return gameState;
  }
}

export class SoftDropCommand implements InputCommand {
  execute(gameState: GameState): GameState {
    if (
      !gameState.currentPiece ||
      gameState.gameStatus !== 'playing' ||
      !isCommandAllowed(gameState)
    ) {
      return gameState;
    }

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, gameState.board);

    const newPosition: Position = {
      x: gameState.currentPosition.x,
      y: gameState.currentPosition.y + 1,
    };

    if (board.canPlacePiece(gameState.currentPiece, newPosition)) {
      return {
        ...gameState,
        currentPosition: newPosition,
        score: gameState.score + GAME_CONFIG.SOFT_DROP_POINTS,
      };
    }

    return gameState;
  }
}

export class HardDropCommand implements InputCommand {
  execute(gameState: GameState): GameState {
    if (
      !gameState.currentPiece ||
      gameState.gameStatus !== 'playing' ||
      !isCommandAllowed(gameState)
    ) {
      return gameState;
    }

    const board = new Board(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT, gameState.board);

    let dropDistance = 0;
    let testY = gameState.currentPosition.y;

    while (
      board.canPlacePiece(gameState.currentPiece, {
        x: gameState.currentPosition.x,
        y: testY + 1,
      })
    ) {
      testY++;
      dropDistance++;
    }

    // Position the piece at the lowest valid row and rely on GameStateManager to finalize locking.

    return {
      ...gameState,
      currentPosition: { x: gameState.currentPosition.x, y: testY },
      score: gameState.score + dropDistance * GAME_CONFIG.HARD_DROP_POINTS,
      lockRequested: true,
    };
  }
}

