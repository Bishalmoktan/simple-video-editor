import fs from "fs";
import path from "path";

/**
 * Ensures the specified directory exists. If not, it creates the directory.
 * @param dirPath - The directory path to ensure.
 */
export const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
