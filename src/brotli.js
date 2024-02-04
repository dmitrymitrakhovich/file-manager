import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { pipeline } from "node:stream/promises";

import { checkExists, getResolvedPath, showError } from "./utils.js";

export const compressFile = async (args) => {
  try {
    const [pathToFile, pathToDestination] = args;

    const absolutePathToFile = getResolvedPath(pathToFile);
    const absolutePathToDestination = getResolvedPath(
      pathToDestination,
      pathToFile + ".br"
    );

    const isAbsolutePathToFileExist = await checkExists(absolutePathToFile);

    if (isAbsolutePathToFileExist) {
      return showError();
    }

    const rs = createReadStream(absolutePathToFile);
    const ws = createWriteStream(absolutePathToDestination);
    const brotliCompress = createBrotliCompress();

    await pipeline(rs, brotliCompress, ws);
  } catch (error) {
    showError(error);
  }
};

export const decompressFile = async (args) => {
  try {
    const [pathToFile, pathToDestination] = args;

    const absolutePathToFile = getResolvedPath(pathToFile);
    const absolutePathToDestination = getResolvedPath(
      pathToDestination,
      pathToFile.slice(0, -3)
    );

    const isAbsolutePathToFileExist = await checkExists(
      absolutePathToDestination
    );

    if (isAbsolutePathToFileExist) {
      return showError();
    }

    const rs = createReadStream(absolutePathToFile);
    const ws = createWriteStream(absolutePathToDestination);
    const brotliDecompress = createBrotliDecompress();

    await pipeline(rs, brotliDecompress, ws);
  } catch (error) {
    showError(error);
  }
};
