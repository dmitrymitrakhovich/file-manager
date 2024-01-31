import os, { EOL } from 'node:os';
import readlinePromises from 'node:readline/promises';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const __dirname = import.meta.dirname;

const transformArguments = (args) => {
  return args.reduce((acc, item) => {
    if (item.startsWith('--')) {
      const [key, value] = item.split('=');
      acc[key.slice(2)] = value;
    } else {
      acc[item] = item;
    }

    return acc;
  }, {});
};

const init = async () => {
  const args = process.argv.slice(2);
  const hashMap = transformArguments(args);

  process.stdout.write(
    `Welcome to the File Manager, ${hashMap.username || 'Anonym'}!` + EOL
  );

  process.chdir(os.homedir());

  process.stdout.write(`You are currently in ${process.cwd()}` + EOL);

  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', async (line) => {
    const [command, ...args] = line.split(' ');

    switch (command) {
      case 'ls':
        try {
          const [targetPath = ''] = args;

          const destinationPath = targetPath
            ? process.cwd() + path.sep + targetPath
            : process.cwd();

          const list = await fsp.readdir(destinationPath, {
            withFileTypes: true,
          });

          const fileTypes = {
            1: 'file',
            2: 'directory',
          };

          const listWithTypes = list.map((file) => {
            const typeSymbol = Object.getOwnPropertySymbols(file)[0];
            const fileTypeValue = file[typeSymbol];

            return {
              Name: file.name,
              Type: fileTypes[fileTypeValue],
            };
          });

          const sortedListByTypes = listWithTypes.sort((a, b) => {
            const typeComparison = a.Type.localeCompare(b.Type);
            if (typeComparison !== 0) {
              return typeComparison;
            }
            return a.Name.localeCompare(b.Name);
          });

          console.table(sortedListByTypes);
        } catch (err) {
          console.error(err);
        }
        break;

      case 'up':
        if (process.cwd() !== '/') {
          process.chdir('..');
        }
        process.stdout.write(`You are currently in ${process.cwd()}` + EOL);

        break;

      case 'cd':
        try {
          const [targetPath = ''] = args;

          if (!targetPath) {
            process.chdir(os.homedir());
          }
          (await fsp.stat(process.cwd() + path.sep + targetPath)).isDirectory();

          process.chdir(process.cwd() + path.sep + targetPath);
          process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
        } catch (error) {
          process.stdout.write(`Operation failed. ${error.message}` + EOL);
        }

        break;

      case '.exit':
        process.stdout.write(
          `Thank you for using File Manager, ${
            hashMap.username || 'Anonym'
          }, goodbye!` + EOL
        );
        process.exit(0);

      default:
        process.stdout.write(
          `Operation failed. Command not found: ${command}` + EOL
        );
        break;
    }
  });

  rl.on('close', () => {
    process.stdout.write(
      `Thank you for using File Manager, ${
        hashMap.username || 'Anonym'
      }, goodbye!` + EOL
    );
    process.exit(0);
  });
};

init();
