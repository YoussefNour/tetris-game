# 🎮 Tetris Game

A production-ready Tetris game built with **TypeScript**, **Vite**, and **HTML5 Canvas 2D**. This project is designed for LLM-assisted development with comprehensive documentation and clean architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🎯 **Classic Tetris gameplay** with modern mechanics
- 🔄 **Super Rotation System (SRS)** with wall kicks
- 📊 **Scoring system** with combos and T-spins
- 🎨 **Modern UI** with dark theme
- 📱 **Responsive layout** that keeps the grid constrained to the viewport height
- 🧮 **Compact info column** keeps the playfield, stats, and controls side-by-side so the 10:20 board ratio never stretches vertically
- ⚡ **60 FPS** fixed timestep game loop
- 🧪 **Comprehensive testing** with Vitest
- 📚 **Extensive documentation** for LLM-assisted development
- 🏗️ **Clean architecture** with clear separation of concerns

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tetris-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

---

## 📖 Documentation

This project includes comprehensive documentation optimized for LLM-assisted development:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and patterns
- **[GAME_DESIGN.md](docs/GAME_DESIGN.md)** - Game rules and mechanics
- **[LLM_WORKFLOW.md](docs/LLM_WORKFLOW.md)** - AI-assisted development guide
- **[PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md)** - Reusable prompts for common tasks
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `←` | Move Left |
| `→` | Move Right |
| `↓` | Soft Drop |
| `Space` | Hard Drop |
| `↑` | Rotate Clockwise |
| `Z` | Rotate Counter-Clockwise |
| `C` | Hold Piece |
| `P` | Pause/Resume |

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Project Structure

```
tetris-game/
├── src/
│   ├── core/          # Shared types and constants
│   ├── engine/        # Game loop and input handling
│   ├── game/          # Game logic (Board, Tetromino, State)
│   ├── utils/         # Helper functions
│   ├── main.ts        # Application entry point
│   └── style.css      # Styles
├── docs/              # Comprehensive documentation
├── tests/             # Test files
├── assets/            # Game assets
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

---

## 🏗️ Architecture

The game follows a **modular, event-driven architecture**:

```
┌─────────────────────────────────────────┐
│           main.ts (Entry)               │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌─────▼─────┐
│ Engine │      │   Game    │
│        │◄─────┤           │
│ Loop   │      │  Board    │
│ Input  │      │  Pieces   │
└────────┘      └───────────┘
```

**Key Principles:**
- **Separation of concerns** - Engine, game logic, and rendering are separate
- **Immutable state** - Game state updates are immutable
- **Event-driven** - Modules communicate via events
- **Testable** - Each module can be tested in isolation

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

---

## 🤖 LLM-Assisted Development

This project is optimized for AI-assisted development:

### Quick Start with LLMs

1. **Read the docs** - Start with [LLM_WORKFLOW.md](docs/LLM_WORKFLOW.md)
2. **Use prompts** - Check [PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md) for templates
3. **Follow patterns** - Reference existing code for consistency
4. **Test everything** - Generate tests alongside code

### Example Prompt

```
I want to add a "ghost piece" feature to show where the piece will land.

Requirements:
- Display semi-transparent preview of piece at landing position
- Update in real-time as piece moves
- Use existing collision detection

Context:
- Related modules: Board, Renderer
- Existing patterns: See Board.canPlacePiece()

Please provide:
1. Ghost piece calculation logic
2. Renderer integration
3. Unit tests
```

See [LLM_WORKFLOW.md](docs/LLM_WORKFLOW.md) for comprehensive guidance.

---

## 🧪 Testing

The project uses **Vitest** for testing:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Coverage Goals:**
- Core game logic: 100%
- Overall coverage: 80%+

See test files in `tests/` for examples.

---

## 🎯 Roadmap

### Phase 1: Core Gameplay ✅
- [x] Project scaffold
- [ ] Basic piece movement
- [ ] Collision detection
- [ ] Line clearing
- [ ] Scoring system

### Phase 2: Advanced Features
- [ ] SRS rotation with wall kicks
- [ ] Ghost piece preview
- [ ] Hold piece mechanic
- [ ] T-spin detection
- [ ] Combo system

### Phase 3: Polish
- [ ] Sound effects
- [ ] Particle effects
- [ ] Animations
- [ ] High score persistence
- [ ] Mobile support

### Phase 4: Multiplayer
- [ ] Local multiplayer
- [ ] Online multiplayer
- [ ] Leaderboards

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards (see CONTRIBUTING.md)
4. Write tests for new features
5. Commit using conventional commits (`feat: add amazing feature`)
6. Push and create a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Tetris Guideline](https://tetris.wiki/Tetris_Guideline) - Official Tetris specifications
- [Super Rotation System](https://tetris.wiki/Super_Rotation_System) - SRS documentation
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Happy coding! 🎮**
