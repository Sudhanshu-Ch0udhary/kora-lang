import { Statement } from "../ast/nodes.js";
import { Environment } from "./environment.js";
import { execute } from "./statements.js";
import { ReturnSignal, StopSignal } from "./control.js";
import { RuntimeValue, NULL } from "./values.js";
import { createStdlib } from "../stdlib/index.js";

export class Interpreter {
  private globalEnv: Environment;

  constructor() {
    this.globalEnv = new Environment();
    const stdlib = createStdlib();
    for (const name in stdlib) {
      this.globalEnv.define(name, stdlib[name]);
    }
  }

  run(program: Statement[]): RuntimeValue {
    try {
      for (const stmt of program) {
        execute(stmt, this.globalEnv);
      }
    } catch (signal) {
      if (signal instanceof ReturnSignal) {
        return signal.value;
      }

      if (signal instanceof StopSignal) {
        throw new Error("Illegal 'stop' outside of loop");
      }

      throw signal;
    }

    return NULL;
  }
  
  getGlobalEnvironment(): Environment {
    return this.globalEnv;
  }
}
