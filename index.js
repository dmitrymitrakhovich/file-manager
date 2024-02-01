import os, { EOL } from 'node:os';
import readlinePromises from 'node:readline/promises';
import fs from 'node:fs';
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

const checkExist = async (path) => {
  try {
    await fsp.access(path);
    return true;
  } catch (error) {
    return false;
  }
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

      case 'cat':
        try {
          const [targetPath = ''] = args;

          const fullPath = process.cwd() + path.sep + targetPath;
          const isFile = (await fsp.stat(fullPath)).isFile();

          if (!isFile) {
            process.stdout.write(`Operation failed. It isn't a file!` + EOL);
            break;
          }

          const ws = fs.createReadStream(fullPath);
          ws.pipe(process.stdout);
          process.stdout.write(EOL);
        } catch (error) {
          process.stdout.write(`Operation failed. ${error.message}` + EOL);
        }
        break;

      case 'add':
        try {
          const [fileName = ''] = args;
          const filePath = process.cwd() + path.sep + fileName;
          const isFileExist = await checkExist(filePath);

          if (isFileExist) {
            process.stdout.write(
              `Operation failed. File has already existed` + EOL
            );
            break;
          }

          await fsp.writeFile(filePath, '');
        } catch (error) {
          process.stdout.write(`Operation failed. ${error.message}` + EOL);
        }
        break;

      case 'rn':
        try {
          const [pathToFile, fileName] = args;
          const filePath = process.cwd() + path.sep + pathToFile;

          const isFileExist = await checkExist(filePath);

          if (!isFileExist) {
            process.stdout.write(`Operation failed. File doesn't exist` + EOL);
            break;
          }

          await fsp.rename(filePath, fileName);
        } catch (error) {
          process.stdout.write(`Operation failed. ${error.message}` + EOL);
        }
        break;

      case 'cp':
        try {
          const [pathFrom, pathTo] = args;

          const fullPathFrom = path.resolve(process.cwd(), pathFrom);
          const fullPathTo = path.resolve(process.cwd(), pathTo, pathFrom);

          const isPathFromExist = await checkExist(fullPathFrom);
          const isPathToExist = await checkExist(fullPathTo);

          if (!isPathFromExist) {
            process.stdout.write(`Operation failed. Check path, please!` + EOL);
            break;
          }

          if (isPathToExist) {
            process.stdout.write(
              `Operation failed. File has already existed` + EOL
            );
            break;
          }

          const rs = fs.createReadStream(fullPathFrom);
          const ws = fs.createWriteStream(fullPathTo);

          await pipeline(rs, ws);
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
        if (command === '') {
          process.stdout.write(EOL);
          break;
        }

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
