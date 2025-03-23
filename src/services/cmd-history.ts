import * as vscode from "vscode";
import { getWorkSpacePath } from "../utils/path";
import fs from "fs";
import path from "path";

function createHistoryFileIfNotExists() {
    const workspacePath = getWorkSpacePath();
    if (!workspacePath) {
        throw new Error("Workspace path not found");
    }

    const filePath = path.join(workspacePath, "movelazy-history.md");
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "");
    }
}

export function cleanHistoryFile() {
    const workspacePath = getWorkSpacePath();
    if (!workspacePath) {
        throw new Error("Workspace path not found");
    }

    const filePath = path.join(workspacePath, "movelazy-history.md");
    fs.writeFileSync(filePath, "");
}

export function saveCommandHistory(command: string, output: string) {
    createHistoryFileIfNotExists();

    const workspacePath = getWorkSpacePath();
    if (!workspacePath) {
        throw new Error("Workspace path not found");
    }

    const filePath = path.join(workspacePath, "movelazy-history.md");
    const history = fs.readFileSync(filePath, "utf-8");

    const now = new Date();
    const timestamp = now.toISOString(); // You can format this as needed
    const newHistory = `[${timestamp}] - ${command}\n${output}\n---\n${history}`;

    fs.writeFileSync(filePath, newHistory);
}