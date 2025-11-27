# Prompt Library for Tetris Development

This library contains reusable prompts for common development tasks. Copy and customize these prompts when working with an LLM.

---

## Table of Contents
- [Feature Development](#feature-development)
- [Bug Fixing](#bug-fixing)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Refactoring](#refactoring)
- [Documentation](#documentation)
- [Architecture](#architecture)

---

## Feature Development

### Add New Game Mechanic

```
I want to add [MECHANIC_NAME] to the Tetris game.

Feature Description:
[Describe what the feature does]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Affected Modules:
- [Module 1]: [What changes]
- [Module 2]: [What changes]

Please provide:
1. Type definitions (update src/core/types.ts)
2. Implementation code
3. Integration with existing systems
4. Unit test skeleton
5. Documentation updates needed

Constraints:
- Must maintain 60 FPS performance
- Should follow existing code patterns
- Must be type-safe
```

**Example: Hold Piece Feature (planning)**

```
I want to plan the "hold piece" mechanic for the Tetris game.

Feature Description:
Players can press 'C' to swap the current piece with a held piece. This is currently a future enhancement.

Requirements:
- Store one held piece in game state
- Swap current piece with held piece on key press
- Prevent multiple swaps per piece
- Display held piece in UI
- First hold stores piece and spawns next piece

Affected Modules:
- GameState: Outline heldPiece/canHold fields
- InputManager: Determine key binding strategy
- Renderer: Sketch held piece display
- Game: Describe hold logic flow

Please provide:
1. Proposed GameState interface changes
2. Conceptual hold logic
3. InputManager integration plan
4. Renderer ideas
5. Suggested tests or checks
```

### Add Visual Effect

```
I want to add [EFFECT_NAME] visual effect.

Effect Description:
[Describe the visual effect]

Trigger:
[When should it appear]

Implementation:
- Canvas API: [2D/WebGL]
- Animation duration: [time]
- Style: [describe appearance]

Please provide:
1. Effect class implementation
2. Integration with Renderer
3. Performance considerations
4. Configuration options
```

### Add Sound Effect

```
I want to add sound effects for [ACTIONS].

Sounds needed:
- [Action 1]: [Description of sound]
- [Action 2]: [Description of sound]

Implementation:
- Use Web Audio API
- Support volume control
- Support mute toggle
- Preload all sounds

Please provide:
1. SoundManager class
2. Integration with game events
3. Configuration for sound files
4. Volume control implementation
```

---

## Bug Fixing

### Debug Collision Issue

```
I'm experiencing incorrect collision detection in [SCENARIO].

Expected Behavior:
[What should happen]

Actual Behavior:
[What is happening]

Reproduction Steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Relevant Code:
[Paste collision detection code]

Error Messages:
[Paste any errors]

What I've Tried:
- [Attempt 1]
- [Attempt 2]

Please:
1. Identify the root cause
2. Explain why it's happening
3. Provide a fix
4. Suggest tests to prevent regression
```

### Debug Rotation Issue

```
Piece rotation is not working correctly for [PIECE_TYPE].

Issue:
[Describe the problem]

Expected SRS Behavior:
[Reference SRS specification]

Current Code:
[Paste rotation logic]

Test Case:
- Piece: [Type]
- Position: (x, y)
- Rotation: [0°/90°/180°/270°]
- Expected result: [describe]
- Actual result: [describe]

Please fix the rotation logic and add tests.
```

### Debug Performance Issue

```
The game is experiencing performance issues:

Symptoms:
- FPS drops to [X] (target: 60)
- Occurs when: [scenario]
- Affects: [which systems]

Profiling Data:
[Paste performance metrics if available]

Suspected Cause:
[Your hypothesis]

Relevant Code:
[Paste suspected bottleneck]

Please:
1. Identify the performance bottleneck
2. Suggest optimization strategies
3. Provide optimized code
4. Explain the performance improvement
```

---

## Performance Optimization

### Optimize Rendering

```
Optimize the rendering pipeline to maintain 60 FPS.

Current Implementation:
[Paste Renderer code]

Performance Issues:
- [Issue 1]
- [Issue 2]

Optimization Goals:
- Reduce draw calls
- Implement dirty rectangle rendering
- Cache static elements
- Use requestAnimationFrame efficiently

Please provide:
1. Optimized Renderer implementation
2. Performance comparison (before/after)
3. Explanation of optimizations
4. Any trade-offs made
```

### Optimize Collision Detection

```
Optimize collision detection for better performance.

Current Implementation:
[Paste collision code]

Optimization Strategies:
- Early exit conditions
- Bounding box checks
- Spatial partitioning (if needed)
- Reduce redundant checks

Please provide:
1. Optimized collision detection
2. Time complexity analysis
3. Benchmark comparison
4. Edge cases handled
```

---

## Testing

### Generate Unit Tests

```
Generate comprehensive unit tests for [MODULE/CLASS/FUNCTION].

Code to Test:
[Paste implementation]

Test Coverage Requirements:
- Happy path scenarios
- Edge cases: [list specific edges]
- Error conditions: [list errors]
- Boundary values
- Integration with [related modules]

Test Framework: Vitest

Please provide:
1. Complete test file
2. Test descriptions
3. Mock/stub setup if needed
4. Coverage for all public methods
```

**Example: Board Tests**

```
Generate comprehensive unit tests for the Board class.

Code to Test:
[Paste Board.ts]

Test Coverage Requirements:
- Board initialization (empty grid)
- Cell get/set operations
- Bounds checking
- Piece placement validation
- Line clearing (single, double, triple, tetris)
- Line clearing with gaps
- Empty board edge case
- Full board edge case

Test Framework: Vitest

Please provide complete test file following the pattern in tests/example.test.ts
```

### Generate Integration Tests

```
Generate integration tests for [FEATURE] that spans multiple modules.

Modules Involved:
- [Module 1]
- [Module 2]
- [Module 3]

Test Scenarios:
1. [Scenario 1]
2. [Scenario 2]
3. [Scenario 3]

Please provide:
1. Integration test file
2. Setup/teardown logic
3. Mock external dependencies
4. Assertions for expected behavior
```

### Generate E2E Test Scenarios

```
Generate end-to-end test scenarios for [USER_FLOW].

User Flow:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Outcomes:
- [Outcome 1]
- [Outcome 2]

Please provide:
1. Test scenario descriptions
2. Test data setup
3. Assertions
4. Cleanup procedures
```

---

## Refactoring

### Extract Class

```
Refactor [FUNCTIONALITY] from [SOURCE_CLASS] into a new [TARGET_CLASS].

Current Implementation:
[Paste code to extract]

Reason for Extraction:
- [Reason 1: e.g., Single Responsibility Principle]
- [Reason 2: e.g., Reusability]

New Class Responsibilities:
- [Responsibility 1]
- [Responsibility 2]

Please provide:
1. New class implementation
2. Updated source class
3. Migration guide
4. Updated tests
```

### Simplify Complex Method

```
Simplify the [METHOD_NAME] method in [CLASS].

Current Implementation:
[Paste complex method]

Issues:
- Too long ([X] lines)
- Multiple responsibilities
- Hard to test
- Difficult to understand

Refactoring Goals:
- Break into smaller methods
- Improve readability
- Maintain functionality
- Add comments

Please provide:
1. Refactored method
2. Extracted helper methods
3. Explanation of changes
4. Updated tests
```

### Apply Design Pattern

```
Refactor [CODE] to use the [PATTERN_NAME] pattern.

Current Implementation:
[Paste code]

Why This Pattern:
[Explain benefits]

Pattern Requirements:
- [Requirement 1]
- [Requirement 2]

Please provide:
1. Refactored code using pattern
2. UML diagram (text-based)
3. Explanation of pattern application
4. Benefits achieved
```

---

## Documentation

### Generate JSDoc

```
Generate comprehensive JSDoc documentation for [MODULE/CLASS/FUNCTION].

Code:
[Paste code]

Documentation Requirements:
- Description
- @param for all parameters (with types)
- @returns with type and description
- @throws for exceptions
- @example with usage example
- @see for related functions
- Edge cases or gotchas

Please provide complete JSDoc comments.
```

### Generate README Section

```
Generate a README section for [FEATURE/MODULE].

Content to Cover:
- Overview
- Installation/Setup
- Usage examples
- API reference
- Configuration options
- Common issues

Target Audience:
[Developers/Users/Both]

Please provide markdown content following the style in README.md
```

### Generate Architecture Diagram

```
Generate a text-based architecture diagram for [SYSTEM/MODULE].

Components:
- [Component 1]
- [Component 2]
- [Component 3]

Relationships:
- [Component 1] → [Component 2]: [relationship]
- [Component 2] → [Component 3]: [relationship]

Please provide:
1. Mermaid diagram code
2. Explanation of architecture
3. Data flow description
```

---

## Architecture

### Design New System

```
Design the architecture for [SYSTEM_NAME].

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Constraints:
- [Constraint 1]
- [Constraint 2]

Integration Points:
- [Existing system 1]
- [Existing system 2]

Please provide:
1. High-level architecture description
2. Component breakdown
3. Interface definitions
4. Data flow diagram
5. Sequence diagram for key operations
6. Trade-offs and design decisions
```

### Evaluate Architecture Decision

```
Evaluate the trade-offs between [APPROACH_A] and [APPROACH_B] for [PROBLEM].

Approach A:
[Describe approach A]

Approach B:
[Describe approach B]

Evaluation Criteria:
- Performance
- Maintainability
- Testability
- Extensibility
- Complexity

Please provide:
1. Comparison table
2. Pros/cons for each approach
3. Recommendation with justification
4. Implementation considerations
```

### Plan Migration

```
Plan a migration from [CURRENT_SYSTEM] to [NEW_SYSTEM].

Current System:
[Describe current implementation]

Target System:
[Describe desired implementation]

Constraints:
- Must maintain backward compatibility
- Zero downtime
- Gradual rollout

Please provide:
1. Migration strategy
2. Step-by-step plan
3. Rollback procedures
4. Testing strategy
5. Risk assessment
```

---

## Quick Reference Prompts

### Quick Fix
```
Fix this bug: [paste error and code]
```

### Quick Feature
```
Add [feature] to [module] following the pattern in [reference file]
```

### Quick Test
```
Generate tests for [paste code]
```

### Quick Docs
```
Document this code: [paste code]
```

### Quick Refactor
```
Refactor this to be more [readable/performant/testable]: [paste code]
```

### Quick Explain
```
Explain how this works: [paste code]
```

---

## Prompt Templates by Role

### For Beginners

```
I'm new to [CONCEPT]. Please:
1. Explain [CONCEPT] in simple terms
2. Show a basic example
3. Explain how it's used in this Tetris project
4. Provide a simple implementation task to practice
```

### For Intermediate Developers

```
I understand [CONCEPT] basics. Please:
1. Explain advanced techniques
2. Show best practices
3. Provide a real-world implementation
4. Suggest optimizations
```

### For Advanced Developers

```
I need to implement [COMPLEX_FEATURE]. Please:
1. Analyze trade-offs between approaches
2. Provide production-ready implementation
3. Include performance considerations
4. Suggest architectural improvements
```

---

## Troubleshooting Prompts

### When LLM Output is Wrong

```
The previous implementation has issues:

Issues Found:
- [Issue 1]
- [Issue 2]

Correct Behavior Should Be:
[Describe correct behavior]

Please fix the implementation addressing these specific issues.
```

### When LLM Output is Incomplete

```
The previous response was incomplete. Please continue from:
[Paste where it stopped]

Still needed:
- [Missing part 1]
- [Missing part 2]
```

### When LLM Misunderstood

```
I think there was a misunderstanding. Let me clarify:

What I Actually Need:
[Clear explanation]

What I Don't Need:
[What was provided but not needed]

Please provide [specific request]
```

---

## Best Practices

1. **Be Specific**: Include exact file names, line numbers, and code snippets
2. **Provide Context**: Reference existing patterns and architecture
3. **Set Constraints**: Specify performance, compatibility, or style requirements
4. **Request Explanations**: Ask "why" not just "what"
5. **Iterate**: Refine prompts based on initial responses
6. **Verify**: Always test LLM-generated code
7. **Document**: Save successful prompts for reuse

---

## Prompt Checklist

Before submitting a prompt, ensure it includes:

- [ ] Clear objective
- [ ] Relevant context (existing code, patterns)
- [ ] Specific requirements
- [ ] Constraints or limitations
- [ ] Expected output format
- [ ] Success criteria

---

## Example Workflow

```
# Session 1: Planning
"Design the architecture for a scoring system following ARCHITECTURE.md patterns"

# Session 2: Types
"Create type definitions for the scoring system in types.ts"

# Session 3: Implementation
"Implement ScoreManager class using the types from previous session"

# Session 4: Testing
"Generate unit tests for ScoreManager covering all scoring rules"

# Session 5: Integration
"Integrate ScoreManager with GameState and Board events"

# Session 6: Documentation
"Generate JSDoc for ScoreManager and update ARCHITECTURE.md"
```
