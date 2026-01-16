import { RuntimeValue, NULL, STRING, INT, NativeFunctionValue } from "../interpreter/values.js";

function format(value: RuntimeValue): string {
  switch (value.type) {
    case "int":
    case "float":
    case "string":
    case "bool":
      return String(value.value);
    case "null":
      return "null";
    default:
      return `<${value.type}>`;
  }
}

function typeOf(value: RuntimeValue): string {
  return value.type;
}

export function createStdlib():Record<string, NativeFunctionValue> {
  return {
    print: {
      type: "native-function",
      name: "print",
      call(args: RuntimeValue[]) {
        for (const arg of args) {
          console.log(format(arg));
        }
        return NULL;
      },
    },

    len: {
      type: "native-function",
      name: "len",
      call(args: RuntimeValue[]) {
        if (args.length !== 1) {
          throw new Error("len expects exactly one argument");
        }
        const v = args[0];
        if (v.type === "string") {
          return INT(v.value.length);
        }

        throw new Error(`len not supported for type '${v.type}'`);
      },
    },

    type: {
      type: "native-function",
      name: "type",
      call(args: RuntimeValue[]) {
        if (args.length !== 1) {
          throw new Error("type expects exactly one argument");
        }

        return STRING(typeOf(args[0]));
      }
    }
  }
}
