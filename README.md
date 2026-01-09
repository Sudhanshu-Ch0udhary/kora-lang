# Kora

Kora is a small, deterministic scripting language designed for safe embedding inside backend systems and controlled execution environments.

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
