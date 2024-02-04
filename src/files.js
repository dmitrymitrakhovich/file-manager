import { createReadStream, createWriteStream } from 'node:fs';
import { rename, rm, writeFile } from 'node:fs/promises';
import { stdout } from 'node:process';

import { checkExists, getResolvedPath, showError } from './utils.js';

export const readFile = async (args) => {
  try {
    const [targetPath] = args;
    const rs = createReadStream(getResolvedPath(targetPath));
    rs.pipe(stdout);
  } catch (error) {
    showError(error);
  }
};

export const addFile = async (args) => {
  try {
    const [newFileName] = args;
    const absolutePathToFile = getResolvedPath(newFileName);
    const isFileExists = await checkExists(absolutePathToFile);

    if (isFileExists) {
      showError();
    }

    await writeFile(absolutePathToFile, '');
  } catch (error) {
    showError(error);
  }
};

export const renameFile = async (args) => {
  try {
    const [pathToFile, newFileName] = args;
    const absolutePathToFile = getResolvedPath(pathToFile);
    const absolutePathToNewFile = getResolvedPath(newFileName);
    const isFileExists = await checkExists(absolutePathToNewFile);

    if (isFileExists) {
      showError();
    }

    await rename(absolutePathToFile, newFileName);
  } catch (error) {
    showError(error);
  }
};

export const copyFile = async (args) => {
  try {
    const [pathToFile, pathToNewDirectory] = args;

    const absolutePathToFile = getResolvedPath(pathToFile);
    const absolutePathToNewFile = getResolvedPath(
      pathToNewDirectory,
      pathToFile
    );

    const isAbsolutePathToNewFileExist = await checkExists(
      absolutePathToNewFile
    );

    if (isAbsolutePathToNewFileExist) {
      showError();
    }

    const rs = createReadStream(absolutePathToFile);
    const ws = createWriteStream(absolutePathToNewFile);

    await pipeline(rs, ws);
  } catch (error) {
    showError(error);
  }
};

export const removeFile = async (args) => {
  try {
    const [pathToFile] = args;
    await rm(getResolvedPath(pathToFile));
  } catch (error) {
    showError(error);
  }
};

export const moveFile = async (args) => {
  try {
    await copyFile(args);
    await removeFile(args);
  } catch (error) {
    showError(error);
  }
};
