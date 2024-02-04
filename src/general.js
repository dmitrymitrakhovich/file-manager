import { EOL, homedir } from "node:os";
import { stdout, chdir, exit, cwd } from "node:process";

import { showError } from "./utils.js";

export const greeting = (username = "Anonymous") => {
  stdout.write(`Welcome to the File Manager, ${username}!` + EOL);

  chdir(homedir());
  stdout.write(`You are currently in ${cwd()}` + EOL);
};

export const close = (username) => {
  stdout.write(`Thank you for using File Manager, ${username}, goodbye!` + EOL);

  exit(0);
};

export const hasUnknownCommand = (command) => {
  if (command === "") {
    stdout.write(EOL);
    return;
  }

  showError(`Command not found: ${command}`);
};
