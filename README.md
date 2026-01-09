# kora

kora is a small, deterministic scripting language designed for safe embedding within backend systems and controlled execution environments.

## Overview

The project explores how limited scripting capabilities can be introduced into server-side systems without sacrificing predictability, isolation, or control.

kora prioritizes determinism and restricted execution over expressiveness.

## Design Goals

- Deterministic execution
- Predictable runtime behavior
- Safe sandboxed execution
- Minimal and explicit language surface

## Execution Model

- Scripts run in a constrained runtime
- No unrestricted system or network access
- Clearly defined execution boundaries
- Designed for embedding, not standalone use

## Intended Use Cases

- Backend rule engines
- Controlled automation workflows
- Embedded logic in orchestration systems
- Safe user-defined behavior in server environments

## Non-Goals

- General-purpose scripting
- High-performance computation
- OS-level access

## Example

```kora
let score = 42

if score < 50 {
  emit("needs_review")
} else {
  emit("approved")
}
```
