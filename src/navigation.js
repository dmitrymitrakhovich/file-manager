import { readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { chdir } from "node:process";
import { table } from "node:console";

import { getResolvedPath, showError } from "./utils.js";

const getListWithTypesSortedByTypes = (list) => {
  const fileTypes = {
    1: "file",
    2: "directory",
  };

  const sortedList = list
    .map((file) => {
      const fileTypeValue = file[Object.getOwnPropertySymbols(file)[0]];
      return { Name: file.name, Type: fileTypes[fileTypeValue] };
    })
    .sort(
      (a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)
    );

  return sortedList;
};

export const getListOfDirsAndFiles = async (args) => {
  try {
    const [targetPath = "."] = args;
    const list = await readdir(getResolvedPath(targetPath), {
      withFileTypes: true,
    });

    const listWithTypesSortedByTypes = getListWithTypesSortedByTypes(list);
    table(listWithTypesSortedByTypes);
  } catch (error) {
    showError(error);
  }
};

export const navigateUp = () => {
  try {
    chdir("..");
  } catch (error) {
    showError(error);
  }
};

export const changeDirectory = (args) => {
  try {
    const [targetPath = ""] = args;

    if (!targetPath) {
      chdir(homedir());
    }

    chdir(getResolvedPath(targetPath));
  } catch (error) {
    showError(error);
  }
};
