# Kora

Kora is a sandboxed, deterministic scripting language designed to safely express user-defined logic and rules inside host applications.

It enables configurable behavior without relying on dynamic code execution, or exposing system resources.

---

## Why Kora?

- Safe alternative to dynamic JavaScript evaluation
- Explicit, typed syntax
- Deterministic and bounded execution
- Designed for embedding, not general-purpose scripting

---

## Example

```kora
func check(int age, int total, bool premium) {
  if age >= 18 and total >= 1000 and premium {
    applyDiscount(10)
  } else {
    deny()
  }
}
