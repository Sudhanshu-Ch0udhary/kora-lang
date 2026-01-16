import { RuntimeValue } from "./values.js";

export class ReturnSignal {
  value: RuntimeValue;

  constructor(value: RuntimeValue) {
    this.value = value;
  }
}

export class StopSignal {
  constructor() {}
}
