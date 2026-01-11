# Kora — Overview

Kora is a small, sandboxed, deterministic scripting language designed to safely express
**user-defined logic** inside host applications.

Kora is not a general-purpose programming language.
It exists to solve a specific problem:  
**running configurable logic without executing untrusted code**.

---

## Why Kora Exists

Many applications need logic that can change without redeploying code:
- business rules
- feature flags
- decision trees
- automation steps

Common solutions today include:
- hardcoded conditionals
- JSON configuration with custom logic
- dynamic JavaScript execution (`eval`, `Function`)

These approaches are either inflexible or unsafe.

Kora provides a middle ground:
> expressive logic without unrestricted power.

---

## What Kora Is

- Interpreted, not executed
- Deterministic and sandboxed
- Explicitly typed
- Designed for embedding

Kora programs describe **decisions**, not **systems**.

---

## What Kora Is Not

Kora is not:
- a replacement for JavaScript or Python
- a systems or scripting language
- a configuration format like JSON
- designed for performance or concurrency

Kora intentionally limits power to guarantee safety.

---

## Core Guarantees

By design, Kora provides:
- no filesystem access
- no network access
- no dynamic code execution
- no access to host globals
- bounded execution

If a capability is not explicitly provided by the host, it does not exist.

---

## Typical Use Cases

- rule engines
- feature gating
- decision logic
- embedded scripting
- security-sensitive environments

---

## Project Status

Kora is under active development.
The language and runtime are evolving together, with a strong focus on clarity,
correctness, and safety.
