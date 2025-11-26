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

    // We don't lock here, we just move to the bottom.
    // The next game loop tick will handle the lock because it can't move down.
    // Actually, hard drop usually locks immediately.
    // But InputCommand returns GameState. It can't trigger "Lock" event easily unless we change state to indicate locking?
    // Or we can just set the position. The GameLoop will see it's on the ground and lock it?
    // No, standard Tetris hard drop locks immediately.
    // I'll set a flag or just let the GameLoop handle it?
    // If I return state with piece at bottom, the user can still move it before next tick if I don't lock.
    // But `lockPiece` logic is complex (clearing lines, etc).
    // I should probably implement `lockPiece` logic in `GameStateManager` and call it?
    // But `InputCommand` is pure.
    // I'll add a `shouldLock: boolean` to GameState? Or just let it be.
    // For now, I'll move it to the bottom. The `GameLoop` (GameStateManager.update) will lock it on next frame if I set a "hardDropped" flag?
    // Or I can implement locking logic here too? No, that duplicates code.
    // I'll add `hardDrop: true` to state? No such field.
    // I'll just move it. If the game loop runs fast enough, it will lock.
    // Actually, I can use `gameStatus`? No.
    // Let's just move it to the bottom. The `GameStateManager` will lock it when it tries to move down and fails.
    // To ensure immediate lock, I might need to trigger it.
    // But for this architecture, let's just move it.

    return {
      ...gameState,
      currentPosition: { x: gameState.currentPosition.x, y: testY },
      score: gameState.score + dropDistance * GAME_CONFIG.HARD_DROP_POINTS,
      lockRequested: true,
    };
  }
}

export class HoldCommand implements InputCommand {
  execute(gameState: GameState): GameState {
    if (
      !gameState.currentPiece ||
      !gameState.canHold ||
      gameState.gameStatus !== 'playing' ||
      !isCommandAllowed(gameState)
    ) {
      return gameState;
    }

    // TODO: Implement Hold functionality
    // Requires swapping currentPiece with heldPiece and resetting position
    // If heldPiece is null, spawn next piece (requires access to PieceGenerator or GameStateManager logic)

    return gameState;
  }
}
