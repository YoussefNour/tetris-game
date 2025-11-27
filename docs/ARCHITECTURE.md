# Tetris Game Architecture

## Table of Contents
- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Core Systems](#core-systems)
- [Module Communication](#module-communication)
- [Extensibility Principles](#extensibility-principles)

---

## Overview

This Tetris implementation follows a **modular architecture** with clear separation of concerns, and we plan to layer in event-driven messaging later:

- **Engine Layer**: Manages the game loop, input handling, and timing
- **Game Layer**: Contains game-specific logic (board, tetrominoes, scoring)
- **Core Layer**: Shared types, interfaces, and constants
- **Utils Layer**: Helper functions and utilities

The architecture is designed to be:
- **Testable**: Each module can be tested in isolation
- **Maintainable**: Clear boundaries between systems
- **Extensible**: Easy to add new features without breaking existing code
- **Event-ready**: Modules can adopt event-driven communication as needs emerge
- **LLM-Friendly**: Well-documented with clear patterns for AI-assisted development

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      main.ts                            │
│              (Application Entry Point)                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│  Engine Layer  │       │   Game Layer    │
│                │       │                 │
│  - GameLoop    │◄──────┤  - Board        │
│  - InputMgr    │       │  - Tetromino    │
│  - Renderer    │       │  - GameState    │
└───────┬────────┘       └────────┬────────┘
        │                         │
        └────────────┬────────────┘
                     │
            ┌────────▼────────┐
            │   Core Layer    │
            │                 │
            │  - Types        │
            │  - Constants    │
            │  - Interfaces   │
            └─────────────────┘
```

---

## Core Systems

### 1. Game Loop Design

The game loop follows the **fixed timestep pattern** for consistent gameplay:

```typescript
class GameLoop {
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedDeltaTime = 1000 / 60; // 60 FPS

  tick(currentTime: number) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed update for game logic
    while (this.accumulator >= this.fixedDeltaTime) {
      this.update(this.fixedDeltaTime);
      this.accumulator -= this.fixedDeltaTime;
    }

    // Render with interpolation
    this.render(this.accumulator / this.fixedDeltaTime);
  }
}
```

**Key Features:**
- **Fixed timestep** for deterministic game logic
- **Variable rendering** for smooth visuals
- **Frame-independent** movement and timing
- **Catch-up mechanism** for slow frames

---

### 2. Input Handling

The `InputManager` uses the **Command Pattern** to decouple input from actions:

```typescript
interface InputCommand {
  execute(gameState: GameState): void;
}

class InputManager {
  private keyBindings: Map<string, InputCommand>;
  private pressedKeys: Set<string>;

  // Handles key repeat, debouncing, and buffering
  update(deltaTime: number): void;
}
```

**Features:**
- **Key buffering** for responsive controls
- **DAS (Delayed Auto Shift)** for horizontal movement
- **ARR (Auto Repeat Rate)** for continuous movement
- **Soft drop** and **hard drop** support
- **Configurable key bindings**

---

### 3. Board/Grid System

The board is represented as a **2D array** with efficient collision detection:

```typescript
class Board {
  private grid: CellType[][];
  private readonly width = 10;
  private readonly height = 20;

  // Check if a tetromino can be placed at position
  canPlacePiece(piece: Tetromino, x: number, y: number): boolean;

  // Lock a piece into the board
  lockPiece(piece: Tetromino, x: number, y: number): void;

  // Clear completed lines and return count
  clearLines(): number;
}
```

**Grid Representation:**
- `0` = Empty cell
- `1-7` = Locked tetromino cells (by type)
- `8` = Ghost piece preview

---

### 4. Tetromino Structure

Each tetromino is defined by its **shape matrix** and **rotation states**:

```typescript
interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
  rotationState: number; // 0-3
}

// Example: I-piece
const I_PIECE = {
  type: 'I',
  shapes: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // 0°
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]], // 90°
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]], // 180°
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]], // 270°
  ]
};
```

---

### 5. Rotation Logic (SRS)

Implements the **Super Rotation System** with wall kicks:

```typescript
class RotationSystem {
  // Attempt rotation with wall kick tests
  rotate(piece: Tetromino, direction: 'CW' | 'CCW'): boolean {
    const newRotation = this.getNextRotation(piece, direction);
    const kickTests = this.getWallKickTests(piece, direction);

    for (const [offsetX, offsetY] of kickTests) {
      if (this.board.canPlacePiece(newRotation, x + offsetX, y + offsetY)) {
        // Apply rotation and offset
        return true;
      }
    }
    return false;
  }
}
```

**Wall Kick Tables:**
- Different tables for I-piece and other pieces
- 5 test positions per rotation
- Enables advanced techniques (T-spins, etc.)

---

### 6. Collision Detection

Fast collision detection using **bounding box + cell checks**:

```typescript
function checkCollision(
  board: Board,
  piece: Tetromino,
  x: number,
  y: number
): boolean {
  const shape = piece.getCurrentShape();

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const boardX = x + col;
        const boardY = y + row;

        // Check bounds
        if (boardX < 0 || boardX >= board.width ||
            boardY >= board.height) {
          return true;
        }

        // Check cell occupation
        if (boardY >= 0 && board.getCell(boardX, boardY) !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}
```

---

### 7. Rendering Pipeline

Rendering is driven by the `GameLoop` render callback registered in `main.ts`. The callback:

1. Clears the canvas with a neon gradient background.
2. Draws a faint grid so the board keeps its 10×20 proportions.
3. Renders locked cells with neon glow using `state.board`.
4. Draws the current tetromino with glow effects on top of the board.
5. Strokes the canvas border and overlays the game/idle messages when needed.

Score, level, and lines stay in sync via the stats callback, which updates DOM elements outside the canvas.

---

### 8. State Management

State is represented by the `GameState` interface (`src/core/types.ts`), which holds the board grid, the current/next piece, the current piece position, and surface statistics such as score, level, lines, and game status. Optional fields (`lockRequested`, `lastSpawnTime`) signal hard drops and spawn debouncing.

`GameStateManager` owns the mutable state, the `PieceGenerator`, and the gravity accumulator. It exposes lifecycle methods such as `startGame`, `update`, `pause`, `resume`, and `reset`. `update` applies gravity, handles hard-drop lock requests, and defers to `lockPiece` (which clears lines and respawns the next piece) whenever the falling tetromino cannot move down.

---

### 9. Timer System

Gravity timer with **level-based speed**:

```typescript
class GravityTimer {
  private accumulator = 0;
  private dropInterval: number;

  update(deltaTime: number, level: number): boolean {
    this.dropInterval = this.calculateDropSpeed(level);
    this.accumulator += deltaTime;

    if (this.accumulator >= this.dropInterval) {
      this.accumulator -= this.dropInterval;
      return true; // Time to drop piece
    }
    return false;
  }

  // Formula: (0.8 - ((level - 1) * 0.007))^(level - 1) seconds
  private calculateDropSpeed(level: number): number;
}
```

---

## Module Communication

Components currently coordinate via synchronous method flows. The `GameLoop` calls `InputManager.update` and caches the resulting state, then `GameStateManager.update` applies gravity, locking, and line clears directly on that state.

```
User Input → InputManager → GameStateManager → Board lock / line clearing
```

An EventBus/plugin layer is planned for future releases so that scoring, audio, or analytics systems can react to game events without being hardwired into this core loop.

---

## Extensibility Principles

The private/public boundaries between `GameLoop`, `InputManager`, and `GameStateManager` keep each system replaceable, so future extensions can be slotted in without touching unrelated modules.

### 1. Plugin Architecture (planned)

By keeping the core loop isolated from rendering and scoring, we can add a lightweight plugin registry later that listens to lifecycle hooks (piece lock, line clear) and reacts accordingly. This future extension will likely leverage the EventBus mentioned above.

### 2. Strategy Pattern

Scoring, gravity timing, and piece generation are factored into helper modules (`GAME_CONFIG`, `calculateDropSpeed`, `PieceGenerator`), making it easy to swap in alternative strategies (e.g., a different scoring formula) by replacing those helpers or injecting new ones into `GameStateManager`.

### 3. Dependency Injection

Classes expose their dependencies via constructors (`GameLoop` receives callbacks, `GameStateManager` owns the `PieceGenerator`, `InputManager` accepts key bindings), which keeps the public API testable and ready for future DI frameworks or fixtures.

---

## LLM Development Guidelines

When working with an LLM to extend this codebase:

1. **Always specify the module** you're working on
2. **Reference existing patterns** from similar modules
3. **Maintain type safety** - update `types.ts` first
4. **Write tests** before implementation
5. **Use TODO comments** to guide incremental development
6. **Document public APIs** with JSDoc
7. **Follow the current synchronous flow** (GameLoop → InputManager → GameStateManager) until the planned EventBus exists

---

## Future Architecture Considerations

- **Web Workers** for game logic (60 FPS guarantee)
- **State serialization** for save/load
- **Replay system** using command pattern
- **Network multiplayer** using deterministic simulation
- **WebGL renderer** for advanced effects
