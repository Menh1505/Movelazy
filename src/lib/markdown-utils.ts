import fs from "fs";
import path from "path";
import * as vscode from "vscode";

// Recursive function to read markdown files
export const readMarkdownFilesRecursively = (
  dir: string,
  baseDir: string
): any[] => {
  const files: any[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      files.push(...readMarkdownFilesRecursively(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push({
        path: relativePath,
        content: fs.readFileSync(fullPath, "utf8"),
      });
    }
  }

  return files;
};

export const getMarkdownFiles = (extensionUri: vscode.Uri) => {
  const filesDirectory = path.join(extensionUri.fsPath, "public", "content");
  if (!fs.existsSync(filesDirectory)) {
    console.error(`Directory ${filesDirectory} does not exist.`);
    return [];
  }
  return readMarkdownFilesRecursively(filesDirectory, filesDirectory);
};
