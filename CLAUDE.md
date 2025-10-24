# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a C++ project in very early development stages. The repository currently contains only a single `main.cpp` file with no build system, tests, or documentation configured. The project will need foundational setup before development can proceed.

## Build and Development Commands

Since this project has no build system configured yet, here are the next steps:

### Recommended Setup
When setting up the project, you should:
1. Create a CMakeLists.txt for building the project
2. Organize code into `src/` and `include/` directories
3. Set up a build directory: `mkdir build && cd build && cmake .. && make`

### Current Status
- No build system in place
- No package manager configured
- Standard C++ compilation would be: `g++ main.cpp -o main` or `clang++ main.cpp -o main`

## Testing

No testing framework is currently configured. When setting up tests:
- Consider using Google Test (gtest) or Catch2
- Create a `test/` directory for test files
- Configure CMake to build and run tests

## Project Structure

Current structure is minimal:
```
/
├── main.cpp          (main source file - currently empty)
├── .git/             (git repository)
└── CLAUDE.md        (this file)
```

## Code Architecture

The project is in pre-architectural phase. No significant architecture exists yet. When developing:
- Keep high-level architecture simple and modular
- Use header files (.h or .hpp) for interfaces
- Implement in corresponding .cpp files
- Use the `src/` directory for implementation files

## Dependencies

No external dependencies are currently configured. The project uses only standard C++.

## Git Workflow

- Main branch: `main`
- Remote: `origin` pointing to `git@github.com:rohitdas2/ykb.git`
- Current status: `main.cpp` is untracked; `main` file is deleted

Remember to commit changes regularly with clear messages describing the work done.
