import * as vscode from 'vscode';

export function getWorkSpacePath(): string {
    return vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
}