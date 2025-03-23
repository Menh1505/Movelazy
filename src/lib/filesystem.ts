import { getMarkdownFiles } from "./markdown-utils";
import * as vscode from "vscode";

interface CodeFile {
  path: string;
  content: string;
}

class FileSystem {
  private files: CodeFile[] = [];
  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri, initialFiles?: CodeFile[]) {
    this.extensionUri = extensionUri;
    if (initialFiles) {
      this.files = [...initialFiles];
    } else {
      // Khởi tạo danh sách file mặc định từ markdown bằng cách sử dụng extensionUri
      this.files = [...getMarkdownFiles(this.extensionUri)];
    }
  }

  addFile(file: CodeFile) {
    this.files.push(file);
  }

  getFileByPath(path: string): CodeFile | undefined {
    return this.files.find((file) => file.path === path);
  }

  getAllFiles(): CodeFile[] {
    return getMarkdownFiles(this.extensionUri);
  }

  updateFile(path: string, content: string): boolean {
    const index = this.files.findIndex((file) => file.path === path);
    if (index !== -1) {
      this.files[index].content = content;
      return true;
    }
    return false;
  }

  deleteFile(path: string): boolean {
    const index = this.files.findIndex((file) => file.path === path);
    if (index !== -1) {
      this.files.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const createFileSystem = (
  extensionUri: vscode.Uri,
  initialFiles?: CodeFile[]
) => {
  return new FileSystem(extensionUri, initialFiles);
};

export type { CodeFile };
