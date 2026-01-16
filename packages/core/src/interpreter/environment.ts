import { RuntimeValue } from "./values.js";

export class Environment {
  private values: Map<string, RuntimeValue>;
  private parent?: Environment;

  constructor(parent?: Environment) {
    this.values = new Map();
    this.parent = parent;
  }

  define(name: string, value: RuntimeValue): void {
    if (this.values.has(name)) {
      throw new Error(`Variable '${name}' already declared in this scope`);
    }
    this.values.set(name, value);
  }

  assign(name: string, value: RuntimeValue): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.parent) {
      this.parent.assign(name, value);
      return;
    }

    throw new Error(`Undefined variable '${name}'`);
  }

  lookup(name: string): RuntimeValue {
    if (this.values.has(name)) {
      return this.values.get(name)!;
    }

    if (this.parent) {
      return this.parent.lookup(name);
    }

    throw new Error(`Undefined variable '${name}'`);
  }
}
