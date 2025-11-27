# Tetris Game Design Document

## Table of Contents
- [Game Rules](#game-rules)
- [Visual Style](#visual-style)
- [Tetromino Types](#tetromino-types)
- [Scoring System](#scoring-system)
- [Level Progression](#level-progression)
- [Speed Curve](#speed-curve)
- [Rotation System](#rotation-system)
- [Drop Mechanics](#drop-mechanics)
- [Game Phases](#game-phases)

---

## Game Rules

### Objective
Arrange falling tetrominoes to create complete horizontal lines, which are then cleared from the board. The game ends when pieces stack to the top of the playfield.

### Core Mechanics

1. **Piece Spawning**
   - New pieces spawn at the top center of the board
   - Spawn position: `x = 3, y = 0` (for 10-wide board)
   - If spawn position is blocked, game over

2. **Piece Movement**
   - **Left/Right**: Move piece horizontally
   - **Down**: Soft drop (faster descent)
   - **Space**: Hard drop (instant placement)
   - **Rotate**: Clockwise/Counter-clockwise rotation

3. **Line Clearing**
   - Complete horizontal lines are cleared
   - Multiple lines can be cleared simultaneously
   - Lines above cleared lines fall down
   - Cleared lines contribute to score and level progression

4. **Game Over Conditions**
   - New piece cannot spawn (blocked)
   - Pieces lock above the visible playfield

---

## Visual Style

The UI embraces a synthwave-inspired presentation to make the gameplay resemble a neon arcade cabinet.

- **Color & Glow**: Deep indigo gradients (#030017 → #1c0941) anchor the background while electric pink (#ff5ef0) and aqua (#34f7ff) strokes illuminate the panels and pieces.
- **Typography**: `Press Start 2P` headlines pair with `Space Grotesk` body copy so text stays legible while still feeling pixelated.
- **Layout**: The playfield is framed in a glassy panel with a glowing grid and scanlines while stat cards (score, level, lines, next preview) follow in a companion column that adapts gracefully to smaller screens.
  Stat cards (score/level/lines) beneath the grid share the same numbers as the canvas overlay thanks to the GameLoop stats callback, ensuring the DOM mirrors every change in `GameStateManager`.
- **Controls**: Command labels sit inside neon-bordered pills arranged in a responsive grid to avoid extra wrappers and keep the focus on the playfield.

## Tetromino Types

There are **7 standard tetrominoes**, each composed of 4 blocks:

| Type | Name      | Color   | Shape Pattern        | Rotation States |
|------|-----------|---------|----------------------|-----------------|
| I    | I-piece   | Cyan    | `████`               | 2 unique        |
| O    | O-piece   | Yellow  | `██`<br>`██`         | 1 (no rotation) |
| T    | T-piece   | Purple  | `▀█▀`<br>`_█_`       | 4 unique        |
| S    | S-piece   | Green   | `_██`<br>`██_`       | 2 unique        |
| Z    | Z-piece   | Red     | `██_`<br>`_██`       | 2 unique        |
| J    | J-piece   | Blue    | `█__`<br>`███`       | 4 unique        |
| L    | L-piece   | Orange  | `__█`<br>`███`       | 4 unique        |

### Piece Generation

**7-Bag Randomizer** (modern standard):
- All 7 pieces are placed in a "bag"
- Pieces are drawn randomly without replacement
- When bag is empty, refill with all 7 pieces
- Ensures fair distribution (max 12 pieces between same type)

```typescript
class PieceGenerator {
  private bag: TetrominoType[] = [];

  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.bag = shuffle(['I', 'O', 'T', 'S', 'Z', 'J', 'L']);
    }
    return this.bag.pop()!;
  }
}
```

---

## Scoring System

### Classic Nintendo Scoring

Points are awarded based on:
- **Lines cleared** (single, double, triple, Tetris)
- **Current level** (multiplier)
- **Soft drop** (optional)
- **Hard drop** (optional)

#### Line Clear Points

| Lines Cleared | Name     | Base Points | Formula          |
|---------------|----------|-------------|------------------|
| 1             | Single   | 100         | 100 × level      |
| 2             | Double   | 300         | 300 × level      |
| 3             | Triple   | 500         | 500 × level      |
| 4             | Tetris   | 800         | 800 × level      |

#### Drop Points

- **Soft Drop**: 1 point per cell dropped
- **Hard Drop**: 2 points per cell dropped

#### Special Moves (Advanced)

| Move          | Condition                    | Bonus Points    |
|---------------|------------------------------|-----------------|
| T-Spin Single | T-piece rotation + 1 line    | 800 × level     |
| T-Spin Double | T-piece rotation + 2 lines   | 1200 × level    |
| T-Spin Triple | T-piece rotation + 3 lines   | 1600 × level    |
| Back-to-Back  | Consecutive Tetris/T-Spins   | 50% bonus       |
| Combo         | Consecutive line clears      | 50 × combo × level |

### Example Calculation

```
Level 5, Tetris (4 lines):
  Base: 800 × 5 = 4,000 points

Level 5, Tetris + Hard Drop (20 cells):
  Line clear: 800 × 5 = 4,000
  Hard drop: 2 × 20 = 40
  Total: 4,040 points
```

---

## Level Progression

### Starting Level
- Default: Level 1
- Optional: Player can choose starting level (1-15)

### Level Up Conditions

**Lines-based progression**:
- Level 1-9: Every 10 lines → level up
- Level 10+: Every 10 lines → level up

```typescript
function calculateLevel(linesCleared: number, startLevel: number): number {
  return Math.floor(linesCleared / 10) + startLevel;
}
```

### Maximum Level
- Typically capped at **Level 29** (near-instant drop)
- Some versions have no cap (kill screen at Level 255)

---

## Speed Curve

### Gravity Speed Formula

The time (in seconds) a piece takes to fall one row:

```
dropSpeed = (0.8 - ((level - 1) × 0.007))^(level - 1)
```

### Speed Table

| Level | Frames per Row | Seconds per Row | Rows per Second |
|-------|----------------|-----------------|-----------------|
| 1     | 48             | 0.80            | 1.25            |
| 2     | 43             | 0.72            | 1.39            |
| 3     | 38             | 0.63            | 1.58            |
| 5     | 28             | 0.47            | 2.13            |
| 10    | 12             | 0.20            | 5.00            |
| 15    | 5              | 0.08            | 12.50           |
| 20    | 2              | 0.03            | 33.33           |
| 29    | 1              | 0.02            | 60.00           |

*Assumes 60 FPS*

---

## Rotation System

### Super Rotation System (SRS)

The modern standard for Tetris rotation.

#### Basic Rotation
- Pieces rotate around a **center point**
- Clockwise (CW) and Counter-Clockwise (CCW) supported
- O-piece does not rotate

#### Wall Kicks

When a rotation would cause a collision, the game tests **5 offset positions**:

```typescript
// Wall kick test positions (I-piece, 0° → 90°)
const kickTests = [
  [0, 0],   // No offset (basic rotation)
  [-2, 0],  // Left 2
  [1, 0],   // Right 1
  [-2, -1], // Left 2, Up 1
  [1, 2],   // Right 1, Down 2
];
```

Different pieces have different kick tables:
- **I-piece**: Special kick table
- **Other pieces**: Standard kick table

#### T-Spin Detection

A T-spin occurs when:
1. Last action was a rotation (not movement)
2. T-piece is in a "T-slot" (3 corners filled)
3. Line clear happens immediately after

---

## Drop Mechanics

### Gravity Drop
- **Automatic**: Piece falls based on level speed
- **Continuous**: Happens every frame according to gravity timer

### Soft Drop
- **Activation**: Hold down arrow key
- **Speed**: 20× faster than gravity (configurable)
- **Scoring**: +1 point per cell
- **Cancellable**: Release key to return to normal speed

### Hard Drop
- **Activation**: Press space bar
- **Speed**: Instant (piece locks immediately)
- **Scoring**: +2 points per cell
- **Lock**: Piece locks on landing (no lock delay)

### Lock Delay

**Lock delay** prevents instant locking when piece touches ground:
- **Timer**: 500ms (configurable)
- **Reset conditions**: Movement or rotation
- **Max resets**: 15 (prevents infinite stalling)
- **Purpose**: Allows last-second adjustments

```typescript
class LockDelay {
  private timer = 0;
  private resetCount = 0;
  private readonly maxDelay = 500;
  private readonly maxResets = 15;

  update(deltaTime: number, onGround: boolean): boolean {
    if (!onGround) {
      this.reset();
      return false;
    }

    this.timer += deltaTime;
    return this.timer >= this.maxDelay;
  }

  reset(): void {
    if (this.resetCount < this.maxResets) {
      this.timer = 0;
      this.resetCount++;
    }
  }
}
```

---

## Game Phases

### 1. Initialization
- Set up board (10×20 grid)
- Initialize piece generator
- Set starting level
- Reset score and statistics

### 2. Piece Spawn
- Get next piece from generator
- Position at spawn point
- Check if spawn is valid
  - **Valid**: Enter active phase
  - **Blocked**: Game over

### 3. Active Phase
- Accept player input (move, rotate, drop)
- Apply gravity
- Update ghost piece position
- Check for ground contact

### 4. Lock Phase
- Start lock delay timer
- Allow movement/rotation (resets timer)
- When timer expires or hard drop:
  - Lock piece to board
  - Check for line clears

### 5. Line Clear Phase
- Detect completed lines
- Calculate score
- Animate line clear (optional)
- Remove lines and drop above rows
- Update statistics

### 6. Level Check
- Check if level up condition met
- Update gravity speed
- Trigger level up event

### 7. Game Over
- Display final score
- Show statistics
- Offer restart/menu options

---

## Game Modes (Future Extensions)

### Marathon Mode
- Goal: Survive as long as possible
- No end condition (except game over)
- Progressive difficulty

### Sprint Mode
- Goal: Clear 40 lines as fast as possible
- Time-based challenge
- No level progression

### Ultra Mode
- Goal: Highest score in 3 minutes
- Time limit: 180 seconds
- Encourages risky play (T-spins, combos)

### Multiplayer
- 1v1 competitive
- Garbage lines sent on multi-line clears
- First to top out loses

---

## Configuration Constants

```typescript
export const GAME_CONFIG = {
  // Board dimensions
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  VISIBLE_HEIGHT: 20,

  // Timing (milliseconds)
  LOCK_DELAY: 500,
  LINE_CLEAR_DELAY: 300,
  DAS_DELAY: 133,      // Delayed Auto Shift
  ARR_DELAY: 33,       // Auto Repeat Rate

  // Scoring
  SCORE_SINGLE: 100,
  SCORE_DOUBLE: 300,
  SCORE_TRIPLE: 500,
  SCORE_TETRIS: 800,
  SOFT_DROP_POINTS: 1,
  HARD_DROP_POINTS: 2,

  // Level progression
  LINES_PER_LEVEL: 10,
  MAX_LEVEL: 29,
};
```

---

## References

- [Tetris Guideline](https://tetris.wiki/Tetris_Guideline)
- [Super Rotation System](https://tetris.wiki/Super_Rotation_System)
- [Scoring Systems](https://tetris.wiki/Scoring)
- [NES Tetris](https://tetris.wiki/Tetris_(NES,_Nintendo))
