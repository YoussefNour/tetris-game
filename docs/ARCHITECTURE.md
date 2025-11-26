# Tetris Game Architecture

## Table of Contents
- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Core Systems](#core-systems)
- [Module Communication](#module-communication)
- [Extensibility Principles](#extensibility-principles)

---

## Overview

This Tetris implementation follows a **modular, event-driven architecture** with clear separation of concerns:

- **Engine Layer**: Manages the game loop, input handling, and timing
- **Game Layer**: Contains game-specific logic (board, tetrominoes, scoring)
- **Core Layer**: Shared types, interfaces, and constants
- **Utils Layer**: Helper functions and utilities

The architecture is designed to be:
- **Testable**: Each module can be tested in isolation
- **Maintainable**: Clear boundaries between systems
- **Extensible**: Easy to add new features without breaking existing code
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

The renderer uses **Canvas 2D API** with double buffering:

```typescript
class Renderer {
  private ctx: CanvasRenderingContext2D;
  private cellSize = 30;

  render(gameState: GameState): void {
    this.clear();
    this.renderBoard(gameState.board);
    this.renderGhostPiece(gameState.currentPiece);
    this.renderCurrentPiece(gameState.currentPiece);
    this.renderNextPiece(gameState.nextPiece);
    this.renderUI(gameState);
  }

  private renderCell(x: number, y: number, color: string): void {
    // Draw cell with border and gradient
  }
}
```

**Rendering Layers:**
1. Background grid
2. Locked pieces
3. Ghost piece (preview)
4. Current piece
5. UI overlay (score, level, next piece)

---

### 8. State Management

Centralized state using **immutable updates**:

```typescript
interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino;
  heldPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  gameStatus: 'playing' | 'paused' | 'gameOver';
}

class GameStateManager {
  private state: GameState;

  // All updates return new state (immutable)
  update(action: GameAction): GameState {
    return this.reducer(this.state, action);
  }
}
```

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

### Event System

Modules communicate via **custom events**:

```typescript
enum GameEvent {
  PIECE_LOCKED = 'piece:locked',
  LINE_CLEARED = 'line:cleared',
  LEVEL_UP = 'level:up',
  GAME_OVER = 'game:over',
}

class EventBus {
  private listeners: Map<GameEvent, Function[]>;

  emit(event: GameEvent, data?: any): void;
  on(event: GameEvent, callback: Function): void;
  off(event: GameEvent, callback: Function): void;
}
```

**Example Flow:**
```
User Input → InputManager → GameState → Board
                                ↓
                          EventBus.emit('piece:locked')
                                ↓
                    ┌───────────┴───────────┐
                    ↓                       ↓
              ScoreManager            SoundManager
```

---

## Extensibility Principles

### 1. Plugin Architecture

Add new features without modifying core:

```typescript
interface GamePlugin {
  name: string;
  init(game: Game): void;
  update(deltaTime: number): void;
  destroy(): void;
}

// Example: Particle effects plugin
class ParticlePlugin implements GamePlugin {
  init(game: Game) {
    game.events.on(GameEvent.LINE_CLEARED, this.spawnParticles);
  }
}
```

### 2. Strategy Pattern

Swap algorithms at runtime:

```typescript
interface ScoringStrategy {
  calculateScore(linesCleared: number, level: number): number;
}

class ClassicScoring implements ScoringStrategy { }
class ModernScoring implements ScoringStrategy { }
```

### 3. Dependency Injection

Testable and flexible:

```typescript
class Game {
  constructor(
    private board: Board,
    private renderer: Renderer,
    private inputManager: InputManager,
    private eventBus: EventBus
  ) {}
}
```

---

## LLM Development Guidelines

When working with an LLM to extend this codebase:

1. **Always specify the module** you're working on
2. **Reference existing patterns** from similar modules
3. **Maintain type safety** - update `types.ts` first
4. **Write tests** before implementation
5. **Use TODO comments** to guide incremental development
6. **Document public APIs** with JSDoc
7. **Follow the event-driven pattern** for cross-module communication

---

## Future Architecture Considerations

- **Web Workers** for game logic (60 FPS guarantee)
- **State serialization** for save/load
- **Replay system** using command pattern
- **Network multiplayer** using deterministic simulation
- **WebGL renderer** for advanced effects
