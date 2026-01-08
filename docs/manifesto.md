# The Kora Language Manifesto

## 1. What Kora Is

**Kora** is a small, sandboxed, deterministic scripting language designed to safely express **user-defined logic and rules** inside host applications.

Kora exists to solve a specific problem:  
allowing configurable behavior without executing untrusted code.

Kora is interpreted, not executed.

---

## 2. The Problem Kora Solves

Modern applications frequently need logic that is:
- configurable
- user-defined
- dynamic at runtime

This logic is often implemented using:
- hardcoded conditionals
- JSON configuration with custom handlers
- dynamic JavaScript evaluation (`eval`, `Function`)

These approaches are either **too rigid** or **unsafe**.

Kora provides a controlled alternative:
> expressive logic without unrestricted power.

---

## 3. Core Design Principles

Kora is built on a small set of non-negotiable principles.

### 3.1 Safety Over Power

Kora intentionally restricts what programs can do.

If a feature compromises isolation, predictability, or safety, it does not belong in Kora.

Power is not removed accidentally — it is removed by design.

---

### 3.2 Explicit Over Implicit

Kora avoids hidden behavior.

Nothing happens automatically.

---

### 3.3 Determinism Over Convenience

Given the same input and context, a Kora program will always produce the same result.

There is:
- no access to time
- no randomness
- no environment access
- no external state

---

### 3.4 Interpretation Over Execution

Kora programs are never executed by the host runtime.

Instead:
- source code is parsed into a structured representation
- each operation is evaluated step by step
- all behavior is controlled by the interpreter

This guarantees complete control over execution.

---

## 4. What Kora Is Not

Kora is **not**:
- a general-purpose programming language
- a replacement for JavaScript, Python, or Lua
- a systems language
- a configuration format like JSON

Kora does not aim to be powerful.
It aims to be **safe, predictable, and readable**.

---

## 5. Safety Guarantees

By design, Kora provides the following guarantees:

- No filesystem access
- No network access
- No dynamic code execution
- No reflection or introspection
- No access to host globals
- No unbounded execution

All loops are interpreter-controlled and step-limited.  
All callable functions must be explicitly injected by the host.

If something is not provided, it does not exist.

---

## 6. Type System Philosophy

Kora uses a small, explicit type system:

- `int`
- `float`
- `string`
- `bool`
- `null`

Types are:
- declared explicitly
- immutable in identity
- never coerced implicitly

This ensures predictable behavior and simplifies reasoning.

---

## 7. Control Flow Philosophy

Kora supports structured control flow only:
- `if / else`
- `while`
- `stop` (loop termination)

There are:
- no jumps
- no exceptions
- no hidden control transfers

Every possible execution path is visible in the source.

---

## 8. Functions and Capabilities

Functions in Kora represent **capabilities**, not privileges.

A Kora program can only call functions that the host explicitly provides.

This enables:
- fine-grained permission control
- safe extensibility
- predictable side effects

---

## 9. Intended Use Cases

Kora is designed for:
- rule engines
- decision logic
- feature gating
- safe automation
- embedded scripting

It is especially suited for multi-tenant or security-sensitive environments.

---

## 10. Design Commitment

Kora commits to:
- clarity over cleverness
- safety over completeness
- minimalism over feature creep

New features must justify their existence within these constraints.

---

## 11. Guiding Principle

> **Kora interprets decisions, not code.**

If a feature violates this principle, it does not belong in the language.

---

## Status

This manifesto defines **Kora v1**.  
All design decisions described here are considered stable.