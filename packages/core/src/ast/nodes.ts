export interface Node {
  kind: string;
  line: number;
  column: number;
}

export interface Expression extends Node {}

export interface Statement extends Node {}