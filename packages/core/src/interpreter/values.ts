export type RuntimeValue = 
| IntValue 
| FloatValue 
| StringValue 
| BoolValue 
| NullValue 
| FunctionValue
| NativeFunctionValue;

export interface IntValue {
  type: "int";
  value: number;
}

export interface FloatValue {
  type: "float";
  value: number;
}

export interface StringValue {
  type: "string";
  value: string;
}

export interface BoolValue {
  type: "bool";
  value: boolean;
}

export interface NullValue {
  type: "null";
}

export interface FunctionValue {
  type: "function";
  name: string;
  parameters: {
    typeName: string;
    name: string;
  }[];
  body: any;
  closure: any; 
}

export interface NativeFunctionValue {
  type: "native-function";
  name: string;
  call: (args: RuntimeValue[]) => RuntimeValue;
}


export const INT = (value: number): IntValue => ({
  type: "int",
  value,
});

export const FLOAT = (value: number): FloatValue => ({
  type: "float",
  value,
});

export const STRING = (value: string): StringValue => ({
  type: "string",
  value,
});

export const BOOL = (value: boolean): BoolValue => ({
  type: "bool",
  value,
});

export const NULL: NullValue = {
  type: "null",
};
