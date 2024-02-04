import { access } from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";
import { cwd, stdout } from "node:process";

const isDev = false;

export const getResolvedPath = (...args) => {
  return resolve(cwd(), ...args);
};

export const showCurrentPath = () => {
  stdout.write(`You are currently in ${cwd()}` + EOL);
};

export const showError = (error = "") => {
  return stdout.write(`Operation failed! ${isDev ? error : ""}` + EOL);
};

export const transformArguments = (args) => {
  return args.reduce((acc, item) => {
    if (item.startsWith("--")) {
      const [key, value] = item.split("=");
      acc[key.slice(2)] = value;
    } else {
      acc[item] = item;
    }

    return acc;
  }, {});
};

export const checkExists = async (sourcePath) => {
  try {
    await access(sourcePath);
    return true;
  } catch (error) {
    return false;
  }
};
