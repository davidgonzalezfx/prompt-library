---
title: Claude init
description: create CLAUDE.md file
tags: ["agents"]
---
# Task: Analyze Codebase and Create CLAUDE.md

You are analyzing a codebase to create a CLAUDE.md file that will guide future Claude Code instances working in this repository.

## Required Content

Include the following in CLAUDE.md:

1. **Development Commands**: Essential commands for:
   - Building the project
   - Running linters
   - Running all tests
   - Running a single test
   - Any other commands critical to development workflow

2. **High-Level Architecture**: The "big picture" that requires reading multiple files to understand:
   - Overall system design and architectural patterns
   - How major components interact
   - Data flow and control flow between modules
   - Key abstractions and design decisions
   - Non-obvious relationships between parts of the codebase

## Analysis Process

1. First, examine existing documentation:
   - Check for existing CLAUDE.md (suggest improvements if found)
   - Read README.md and extract important technical details
   - Check .cursor/rules/ or .cursorrules for Cursor-specific guidance
   - Check .github/copilot-instructions.md for Copilot-specific guidance
   - Incorporate relevant content from these files

2. Analyze the codebase structure to understand architecture

3. Identify the actual build/test/lint commands used in this project

## Requirements and Constraints

**MUST include** as the first lines:
```
# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
```

**DO NOT include**:
- Generic best practices (e.g., "write unit tests", "provide helpful errors", "don't commit secrets")
- Obvious information easily discoverable by exploring files
- Exhaustive file/folder listings
- Fabricated sections like "Common Development Tasks", "Tips for Development", "Support and Documentation" unless these explicitly exist in source documentation
- Repetitive content
- Basic development practices applicable to any project

**Focus on**:
- Project-specific, actionable information
- Non-obvious architectural insights
- Actual commands found in package.json, Makefile, or other build configurations
- Information that saves time by preventing the need to read multiple files

Analyze the codebase now and create the CLAUDE.md file.
