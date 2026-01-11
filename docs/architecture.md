# Kora — Architecture

This document describes the internal architecture of the Kora language implementation.
It is intended for contributors, maintainers, and readers who want to understand how the
language is built and why certain design decisions were made.

Kora follows a traditional language pipeline with strict separation of concerns.

---

## High-Level Pipeline

Kora processes source code in four distinct stages:

# Kora — Architecture

This document describes the internal architecture of the Kora language implementation.
It is intended for contributors, maintainers, and readers who want to understand how the
language is built and why certain design decisions were made.

Kora follows a traditional language pipeline with strict separation of concerns.

---

## High-Level Pipeline

Kora processes source code in four distinct stages:

Source Code
↓
Lexer → Token[]
↓
Parser → AST (Abstract Syntax Tree)
↓
Interpreter → Runtime behavior


Each stage is isolated, testable, and replaceable.

---

## Core Package Structure

All language logic lives in the `@kora-lang/core` package.

packages/core/src/
├── lexer/
├── parser/
├── ast/ 
├── interpreter/ 
├── types/ 
├── errors/ 
└── index.ts 


The `core` package is designed to be used by:
- a CLI
- a web playground
- a VS Code extension
- embedded host applications

---

## Lexer

### Responsibility

The lexer converts raw source code into a linear stream of tokens.


The `core` package is designed to be used by:
- a CLI
- a web playground
- a VS Code extension
- embedded host applications

---

## Lexer

### Responsibility

The lexer converts raw source code into a linear stream of tokens.

string → Token[]


### Key Properties

- Single-pass
- Deterministic
- No execution or evaluation
- No grammar awareness

### Design Notes

- Keywords are centralized in `keywords.ts`
- Identifiers and keywords share the same scanning logic
- Line and column information is attached at the token level
- The lexer never throws generic errors — all errors include source location

---

## AST (Abstract Syntax Tree)

### Responsibility

The AST defines the **structure** of the language without implementing behavior.

It is a pure data representation.

AST ≠ execution
AST ≠ parsing
AST = structure only

### Design Principles

- Expressions and statements are explicitly separated
- Every node has:
  - a `kind` discriminator
  - `line` and `column` metadata
- No methods or logic exist on AST nodes

This makes the AST:
- easy to serialize
- easy to test
- easy to interpret using visitors or switches

---

## Parser

### Responsibility

The parser transforms a token stream into an AST.

Token[] → Statement[]


### Parsing Strategy

- Recursive descent
- Explicit grammar rules
- Operator precedence encoded via function hierarchy

### Expression Parsing

Expressions are parsed using a layered precedence approach:

logicalOr
 → logicalAnd
  → equality
   → comparison
    → term
     → factor
      → unary
       → primary


Each function corresponds to a grammar rule and handles exactly one precedence level.

### Statement Parsing

Statements are parsed at the program level and dispatched based on leading tokens.
For example:
- type keywords → variable declarations
- `if` keyword → conditional statements
- fallback → expression statements

The parser does not execute or evaluate anything.

---

## Interpreter (Planned)

### Responsibility

The interpreter will:
- walk the AST
- evaluate expressions
- execute statements
- enforce safety and determinism

AST → behavior


### Design Goals

- No access to host globals
- Explicit capability injection
- Step-limited execution
- Deterministic behavior

The interpreter will be implemented **after** the full grammar is stable.

---

## Public API Boundary

The `index.ts` file defines what the core package exposes publicly.

Internal modules such as the lexer, parser, and AST are **not** intended to be imported
directly by consumers.

This allows:
- internal refactors
- stable external APIs
- multiple tooling layers on top of the same core

---

## Design Philosophy Summary

- Each stage has exactly one responsibility
- No stage depends on runtime behavior
- No shortcuts via dynamic execution
- Safety and clarity take precedence over brevity

This architecture prioritizes correctness, maintainability, and long-term evolution
over short-term convenience.
