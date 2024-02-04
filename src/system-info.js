import { log } from "node:console";
import { EOL, arch, cpus, homedir, userInfo } from "node:os";

import { showError } from "./utils.js";

export const getSystemInfo = async (args) => {
  try {
    const [arg] = args;

    if (arg === "--EOL") {
      return log(EOL);
    }

    if (arg === "--cpus") {
      return log(cpus());
    }

    if (arg === "--homedir") {
      return log(homedir());
    }

    if (arg === "--username") {
      return log(userInfo().username);
    }

    if (arg === "--architecture") {
      return log(arch());
    }

    if (!arg) {
      showError();
    }
  } catch (error) {
    showError(error);
  }
};
