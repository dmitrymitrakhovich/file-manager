import readlinePromises from "node:readline/promises";
import { stdin, stdout } from "node:process";

export const rl = readlinePromises.createInterface({
  input: stdin,
  output: stdout,
});
