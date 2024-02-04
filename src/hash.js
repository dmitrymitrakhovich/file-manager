import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { EOL } from "node:os";
import { stdout } from "node:process";

import { getResolvedPath, showError } from "./utils.js";

export const calculateHashForFile = async (args) => {
  try {
    const [pathToFile] = args;
    const absolutePathToFile = getResolvedPath(pathToFile);

    const hash = createHash("sha256");

    const rs = createReadStream(absolutePathToFile);
    rs.on("data", (data) => hash.update(data));
    rs.on("error", (error) => showError(error));
    rs.on("end", () => stdout.write(`${hash.digest("hex")}${EOL}`));
  } catch (error) {
    showError(error);
  }
};
