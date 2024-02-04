import { argv } from 'node:process';

import {
  readFile,
  addFile,
  copyFile,
  moveFile,
  removeFile,
  renameFile,
} from './src/files.js';
import { close, greeting, hasUnknownCommand } from './src/general.js';
import {
  getListOfDirsAndFiles,
  navigateUp,
  changeDirectory,
} from './src/navigation.js';
import { getSystemInfo } from './src/system-info.js';
import { rl } from './src/readline.js';
import { calculateHashForFile } from './src/hash.js';
import { compressFile, decompressFile } from './src/brotli.js';

import { showError, transformArguments } from './src/utils.js';

const init = async () => {
  try {
    const args = argv.slice(2);
    const { username } = transformArguments(args);

    greeting(username);

    rl.on('line', async (line) => {
      const [command, ...args] = line.split(' ');

      switch (command) {
        case 'ls':
          getListOfDirsAndFiles(args);
          break;

        case 'up':
          navigateUp();
          break;

        case 'cd':
          changeDirectory(args);
          break;

        case 'cat':
          await readFile(args);
          break;

        case 'add':
          addFile(args);
          break;

        case 'rn':
          renameFile(args);
          break;

        case 'cp':
          copyFile(args);
          break;

        case 'mv':
          moveFile(args);
          break;

        case 'rm':
          removeFile(args);
          break;

        case 'os':
          getSystemInfo(args);
          break;

        case 'hash':
          calculateHashForFile(args);
          break;

        case 'compress':
          compressFile(args);
          break;

        case 'decompress':
          decompressFile(args);
          break;

        case '.exit':
          close(username);
          break;

        default:
          hasUnknownCommand(command);
          break;
      }
    });

    rl.on('close', () => {
      close(username);
    });
  } catch (error) {
    showError(error);
  }
};

init();
