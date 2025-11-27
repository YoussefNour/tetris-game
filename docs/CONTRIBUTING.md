# Contributing to Tetris Game

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Code Review Checklist](#code-review-checklist)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd AiTetrisTrial

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

### Project Structure

```
src/
  core/       # Shared types and interfaces
  engine/     # Game loop and input handling
  game/       # Game-specific logic
  utils/      # Helper functions
docs/         # Documentation
tests/        # Test files
```

---

## Development Workflow

### 1. Create a Branch

Use descriptive branch names:

```bash
# Feature branches
git checkout -b feature/hold-piece
git checkout -b feature/ghost-piece

# Bug fix branches
git checkout -b fix/rotation-bug
git checkout -b fix/collision-detection

# Refactoring branches
git checkout -b refactor/renderer-optimization
```

### 2. Make Changes

- Follow the coding standards (see below)
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage

# Type check
npm run type-check

# Lint code
npm run lint
```

### 4. Commit Your Changes

Follow conventional commits (see below)

### 5. Push and Create PR

```bash
git push origin feature/your-feature
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

- **Use strict mode**: All code must pass `strict: true` TypeScript checks
- **Explicit types**: Avoid `any`, use proper types
- **Interfaces over types**: Prefer `interface` for object shapes
- **Immutability**: Use `readonly` where appropriate

```typescript
// ✅ Good
interface GameState {
  readonly score: number;
  readonly level: number;
}

function updateScore(state: GameState, points: number): GameState {
  return { ...state, score: state.score + points };
}

// ❌ Bad
function updateScore(state: any, points: any) {
  state.score += points; // Mutation!
  return state;
}
```

### Naming Conventions

- **Classes**: PascalCase (`GameLoop`, `Tetromino`)
- **Interfaces**: PascalCase (`GameState`, `InputCommand`)
- **Functions**: camelCase (`calculateScore`, `checkCollision`)
- **Constants**: UPPER_SNAKE_CASE (`BOARD_WIDTH`, `MAX_LEVEL`)
- **Private members**: prefix with `_` (`_accumulator`, `_grid`)

```typescript
// ✅ Good
const BOARD_WIDTH = 10;

class GameLoop {
  private _lastTime = 0;

  public update(deltaTime: number): void {
    // ...
  }
}

// ❌ Bad
const boardwidth = 10;

class gameLoop {
  public LastTime = 0;
}
```

### Code Organization

- **One class per file**: Each class in its own file
- **Barrel exports**: Use `index.ts` for module exports
- **Group imports**: Standard library → External → Internal

```typescript
// ✅ Good
// External imports
import { EventEmitter } from 'events';

// Internal imports
import { GameState } from '@core/types';
import { Board } from '@game/Board';
import { Tetromino } from '@game/Tetromino';

// ❌ Bad
import { Tetromino } from '@game/Tetromino';
import { EventEmitter } from 'events';
import { Board } from '@game/Board';
import { GameState } from '@core/types';
```

### Comments and Documentation

- **JSDoc for public APIs**: All public methods and classes
- **Inline comments for complex logic**: Explain "why", not "what"
- **TODO comments**: Use for future improvements

```typescript
/**
 * Checks if a tetromino can be placed at the specified position.
 *
 * @param piece - The tetromino to check
 * @param x - X coordinate on the board
 * @param y - Y coordinate on the board
 * @returns True if the piece can be placed, false otherwise
 *
 * @example
 * ```ts
 * const canPlace = board.canPlacePiece(tetromino, 3, 0);
 * if (canPlace) {
 *   board.lockPiece(tetromino, 3, 0);
 * }
 * ```
 */
public canPlacePiece(piece: Tetromino, x: number, y: number): boolean {
  // Use SRS collision detection
  // TODO: Optimize with bounding box check first
  return !this.checkCollision(piece, x, y);
}
```

### Error Handling

- **Use custom errors**: Create specific error types
- **Validate inputs**: Check preconditions
- **Fail fast**: Throw errors early

```typescript
// ✅ Good
class InvalidPositionError extends Error {
  constructor(x: number, y: number) {
    super(`Invalid position: (${x}, ${y})`);
    this.name = 'InvalidPositionError';
  }
}

function placePiece(x: number, y: number): void {
  if (x < 0 || x >= BOARD_WIDTH) {
    throw new InvalidPositionError(x, y);
  }
  // ...
}

// ❌ Bad
function placePiece(x: number, y: number): void {
  if (x >= 0 && x < BOARD_WIDTH) {
    // ... nested logic
  }
}
```

---

## Commit Guidelines

### Conventional Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples

```bash
# Feature
git commit -m "feat(game): add hold piece mechanic"

# Bug fix
git commit -m "fix(rotation): correct I-piece wall kick table"

# Documentation
git commit -m "docs(architecture): update rendering pipeline diagram"

# Refactoring
git commit -m "refactor(board): extract line clearing logic"

# Performance
git commit -m "perf(renderer): implement dirty rectangle rendering"

# Tests
git commit -m "test(tetromino): add rotation edge cases"
```

#### Detailed Commit

```
feat(game): refine rotation handling

Tighten up the rotation system with full SRS wall kicks and ensure locked pieces remain stable.

- Add wall kick offset tables to `RotateCommand`
- Surface rotation helpers through `Tetromino` utilities
- Add regression tests for edge-case rotations

Closes #42
```

### Commit Best Practices

- **Atomic commits**: One logical change per commit
- **Present tense**: "Add feature" not "Added feature"
- **Imperative mood**: "Fix bug" not "Fixes bug"
- **Reference issues**: Use "Closes #123" or "Fixes #456"

---

## Pull Request Process

### Before Creating PR

- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Types are correct (`npm run type-check`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Title

Use conventional commit format:

```
feat(game): add hold piece mechanic
fix(rotation): correct wall kick behavior
docs(readme): update installation instructions
```

### PR Description Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] All tests pass

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for new features
- [ ] All tests pass
```

### Review Process

1. **Automated checks**: CI must pass
2. **Code review**: At least one approval required
3. **Address feedback**: Make requested changes
4. **Merge**: Squash and merge to main

---

## Testing Requirements

### Test Coverage

- **Minimum coverage**: 80% for all new code
- **Critical paths**: 100% coverage for core game logic
- **Edge cases**: Test boundary conditions

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '@game/Board';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('initialization', () => {
    it('should create empty grid', () => {
      expect(board.isEmpty()).toBe(true);
    });

    it('should have correct dimensions', () => {
      expect(board.width).toBe(10);
      expect(board.height).toBe(20);
    });
  });

  describe('clearLines', () => {
    it('should clear single line', () => {
      // Arrange
      board.fillRow(19);

      // Act
      const cleared = board.clearLines();

      // Assert
      expect(cleared).toBe(1);
      expect(board.isEmpty()).toBe(true);
    });

    it('should clear multiple lines', () => {
      // Test implementation
    });

    it('should not clear incomplete lines', () => {
      // Test implementation
    });
  });
});
```

### Test Categories

1. **Unit tests**: Test individual functions/classes
2. **Integration tests**: Test module interactions
3. **E2E tests**: Test complete user flows (future)

---

## Code Review Checklist

### For Authors

Before requesting review:

- [ ] Code is self-explanatory
- [ ] Complex logic has comments
- [ ] No console.log or debug code
- [ ] No commented-out code
- [ ] Error handling is appropriate
- [ ] Performance is acceptable
- [ ] Security considerations addressed

### For Reviewers

When reviewing code:

- [ ] **Correctness**: Does it work as intended?
- [ ] **Design**: Is the architecture sound?
- [ ] **Complexity**: Is it as simple as possible?
- [ ] **Tests**: Are tests comprehensive?
- [ ] **Naming**: Are names clear and consistent?
- [ ] **Documentation**: Is it well-documented?
- [ ] **Performance**: Are there obvious optimizations?
- [ ] **Security**: Are there vulnerabilities?

### Review Feedback Guidelines

- **Be constructive**: Suggest improvements, don't just criticize
- **Be specific**: Point to exact lines and explain why
- **Ask questions**: "Could we use X instead?" vs "This is wrong"
- **Praise good code**: Acknowledge well-written code

#### Good Feedback Examples

```
✅ "Consider using a Map instead of an object here for O(1) lookups"
✅ "This function is doing too much. Could we extract the validation logic?"
✅ "Nice use of the strategy pattern here!"
✅ "Could you add a comment explaining why we need this edge case check?"

❌ "This is bad"
❌ "Wrong approach"
❌ "Rewrite this"
```

---

## Branching Strategy

### Main Branches

- **main**: Production-ready code
- **develop**: Integration branch (if using Git Flow)

### Supporting Branches

- **feature/\***: New features
- **fix/\***: Bug fixes
- **refactor/\***: Code refactoring
- **docs/\***: Documentation updates

### Branch Lifecycle

```
main
  └─ feature/hold-piece
       ├─ commit 1
       ├─ commit 2
       └─ commit 3
  ← merge (squash)
```

---

## Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

---

## Questions?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design questions
- Check [LLM_WORKFLOW.md](./LLM_WORKFLOW.md) for AI-assisted development
- Check [PROMPT_LIBRARY.md](./PROMPT_LIBRARY.md) for common prompts
- Open an issue for other questions

---

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
