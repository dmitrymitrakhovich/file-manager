import { argv } from "node:process";

import {
  readFile,
  addFile,
  copyFile,
  moveFile,
  removeFile,
  renameFile,
} from "./src/files.js";
import { close, greeting, hasUnknownCommand } from "./src/general.js";
import {
  getListOfDirsAndFiles,
  navigateUp,
  changeDirectory,
} from "./src/navigation.js";
import { getSystemInfo } from "./src/system-info.js";
import { rl } from "./src/readline.js";
import { calculateHashForFile } from "./src/hash.js";
import { compressFile, decompressFile } from "./src/brotli.js";

import { showCurrentPath, showError, transformArguments } from "./src/utils.js";

const init = async () => {
  try {
    const args = argv.slice(2);
    const { username } = transformArguments(args);

    greeting(username);

    rl.on("line", async (line) => {
      const [command, ...args] = line.split(" ");

      switch (command) {
        case "ls":
          await getListOfDirsAndFiles(args);
          break;

        case "up":
          navigateUp();
          break;

        case "cd":
          changeDirectory(args);
          break;

        case "cat":
          await readFile(args);
          break;

        case "add":
          await addFile(args);
          break;

        case "rn":
          await renameFile(args);
          break;

        case "cp":
          await copyFile(args);
          break;

        case "mv":
          await moveFile(args);
          break;

        case "rm":
          await removeFile(args);
          break;

        case "os":
          await getSystemInfo(args);
          break;

        case "hash":
          await calculateHashForFile(args);
          break;

        case "compress":
          await compressFile(args);
          break;

        case "decompress":
          await decompressFile(args);
          break;

        case ".exit":
          close(username);
          break;

        default:
          hasUnknownCommand(command);
          break;
      }

      showCurrentPath();
    });

    rl.on("close", () => {
      close(username);
    });
  } catch (error) {
    showError(error);
  }
};

init();
