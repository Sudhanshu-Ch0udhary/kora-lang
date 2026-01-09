# Kora

Kora is a small, deterministic scripting language designed for safe embedding within backend systems and controlled execution environments.

## Overview

kora-lang explores how simple scripting capabilities can be safely introduced into backend systems without sacrificing predictability, isolation, or control.

The language prioritizes determinism and restricted execution over expressiveness.

## Design Goals

- Deterministic execution
- Predictable runtime behavior
- Safe sandboxed execution
- Minimal surface area for misuse

## Execution Model

- Scripts execute in a constrained runtime
- No unrestricted system or network access
- Clearly defined execution boundaries
- Designed for embedding rather than standalone usage

## Intended Use Cases

- Backend rule engines
- Controlled automation workflows
- Embedded logic for orchestration systems
- Safe user-defined behavior in server environments

## Non-Goals

- General-purpose scripting
- High-performance computation
- Full OS-level access

## Status

Experimental and under active iteration.
