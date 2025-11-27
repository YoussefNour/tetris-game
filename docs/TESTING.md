# Testing

## Running the Suite

- `npm run test` – Launches the Vitest runner in the default mode for quick iteration.
- `npm run test:coverage` – Runs Vitest with coverage reporting via `@vitest/coverage-v8`. This is the command to verify the current coverage targets, especially after touching `Board`, `Tetromino`, or `GameLoop` logic.

## Coverage Expectations

- Keep coverage above the current baseline provided by `tests/Board.test.ts`, `tests/Tetromino.test.ts`, and `tests/GameLoop.test.ts`. These files should cover collisions, rotation logic, bag refill behavior, and fixed-timestep loop callbacks.
- When a change touches any new module, add focused tests that exercise both the happy path and the edge conditions (e.g., collision detection, wall kicks, animation tick scheduling) before running the coverage suite.

## Workflow Tips

- Run coverage locally before creating a PR to ensure new assertions land without regressions.
- If tests need browser globals (e.g., `window`, `performance`, or `requestAnimationFrame`), stub them inside the test file so the suite remains environment-agnostic.

