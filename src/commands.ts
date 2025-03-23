import * as vscode from 'vscode';
import { getTempFilePath, deleteTempFile } from './utils/tempFile';
import { execAsync } from './utils/execAsync';
import { promisify } from "util";
import axios from 'axios';
import { exec, spawnSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import { lastHoveredMoveLazyPosition } from './state';
import path from 'path';
import { getCachedOutput, setCachedOutput } from './utils/cache';
import { getWorkSpacePath } from './utils/path';

const executingDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    isWholeLine: true,
});

export function registerCommands(context: vscode.ExtensionContext) {
    const removeOutputCommand = vscode.commands.registerCommand("extension.removeOutput", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No active editor.");
            return;
        }
        deleteOutputBlock(editor.document, editor.selection.active);
    });

    const runMoveLazyCommand = vscode.commands.registerCommand("extension.runMoveLazy", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No active editor.");
            return;
        }
        if (!checkRustInstalled()) {
            vscode.window.showErrorMessage("❌ Rust not installed.");
            return;
        }
        const document = editor.document;
        const text = document.getText();
        const wordIndex = lastHoveredMoveLazyPosition ? document.offsetAt(lastHoveredMoveLazyPosition) : null;
        if (wordIndex === null) {
            vscode.window.showErrorMessage("❌ Could not find `move_lazy`.");
            return;
        }
        const codeBlockRegex = /```(rust|ai)(?:\s+\w+)?\s*\n([\s\S]+?)\n```/g;
        const referenceRegex = /<!--\s*@movelazy:\s*(.+?)#(.+?)\s*-->/;
        let match, targetCodeBlock = null, endOfCodeBlockPosition = null, language = null;
        while ((match = codeBlockRegex.exec(text)) !== null) {
            const matchStartIndex = document.offsetAt(document.positionAt(match.index));
            if (matchStartIndex > wordIndex) {
                language = match[1];
                targetCodeBlock = match[2].trim();
                endOfCodeBlockPosition = document.positionAt(match.index + match[0].length);
                break;
            }
        }

        if (!targetCodeBlock || !endOfCodeBlockPosition) {
            const referenceMatch = referenceRegex.exec(text);
            if (referenceMatch) {
                const referencePath = referenceMatch[1].trim();
                const blockId = referenceMatch[2].trim();
                const absolutePath = path.isAbsolute(referencePath) ? referencePath : path.join(path.dirname(document.uri.fsPath), referencePath);
                const referencedDocument = await vscode.workspace.openTextDocument(absolutePath);
                const referencedText = referencedDocument.getText();
                const referencedCodeBlockMatch = new RegExp(`\`\`\`(rust|ai)\\s+${blockId}\\s*\\n([\\s\\S]+?)\\n\`\`\``).exec(referencedText);
                if (referencedCodeBlockMatch) {
                    language = referencedCodeBlockMatch[1];
                    targetCodeBlock = referencedCodeBlockMatch[2].trim();
                    endOfCodeBlockPosition = document.positionAt(referenceMatch.index + referenceMatch[0].length);
                }
            }
        }

        if (!targetCodeBlock || !endOfCodeBlockPosition) {
            vscode.window.showErrorMessage("❌ No code block found.");
            return;
        }

        const cacheKey = `${language}:${targetCodeBlock}`;
        const cachedOutput = getCachedOutput(cacheKey);
        if (cachedOutput) {
            insertOutputIntoMarkdown(document, endOfCodeBlockPosition, cachedOutput);
            vscode.window.showInformationMessage("✅ Execution successful (cached)!");
            return;
        }

        const codeBlockRange = new vscode.Range(
            document.positionAt(text.indexOf(targetCodeBlock)),
            document.positionAt(text.indexOf(targetCodeBlock) + targetCodeBlock.length)
        );
        editor.setDecorations(executingDecorationType, [codeBlockRange]);

        if (language === "rust") {
            await runMoveCode(document, targetCodeBlock, endOfCodeBlockPosition, cacheKey);
        } else if (language === "ai") {
            await runMoveAi(document, targetCodeBlock, endOfCodeBlockPosition, cacheKey);
        } else {
            vscode.window.showErrorMessage("❌ Unsupported code block language.");
            return;
        }

        editor.setDecorations(executingDecorationType, []);
    });

    context.subscriptions.push(removeOutputCommand, runMoveLazyCommand);
}

function deleteOutputBlock(document: vscode.TextDocument, position: vscode.Position) {
    const text = document.getText();
    const outputBlockRegex = /```output\r?\n([\s\S]*?)```/g;
    let match;
    let edit = new vscode.WorkspaceEdit();

    while ((match = outputBlockRegex.exec(text)) !== null) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);

        console.log(`Block found from line ${start.line} to ${end.line}`);
        console.log(`Clicked on line ${position.line}`);

        if (position.line >= start.line && position.line <= end.line) {
            console.log("Deleting output block...");
            edit.delete(document.uri, new vscode.Range(start, end));
            vscode.workspace.applyEdit(edit);
            vscode.window.showInformationMessage("✅ Output block deleted!");
            return;
        }
    }

    console.log("No matching output block found.");
}

function insertOutputIntoMarkdown(document: vscode.TextDocument, insertPosition: vscode.Position, outputText: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(document.uri, insertPosition, `\n\`\`\`output\n${outputText.trim()}\n\`\`\`\n`);
    vscode.workspace.applyEdit(edit);
}

function checkRustInstalled(): boolean {
    return !spawnSync("rustc", ["--version"], { encoding: "utf-8" }).error;
}

async function runMoveCode(document: vscode.TextDocument, targetCodeBlock: string, endOfCodeBlockPosition: vscode.Position, cacheKey: string) {
    const tempFilePath = getTempFilePath('rs');
    const outputFilePath = getTempFilePath(os.platform() === "win32" ? "exe" : "");

    try {
        await fs.promises.writeFile(tempFilePath, targetCodeBlock);
        const compileCommand = `rustc "${tempFilePath}" -o "${outputFilePath}"`;
        await execAsync(compileCommand);

        const runCommand = os.platform() === "win32" ? `"${outputFilePath}"` : `./"${outputFilePath}"`;
        const { stdout } = await execAsync(runCommand);

        insertOutputIntoMarkdown(document, endOfCodeBlockPosition, stdout);
        setCachedOutput(cacheKey, stdout);
        vscode.window.showInformationMessage("✅ Execution successful!");
    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Error: ${error.stderr || error.message}`);
    } finally {
        await deleteTempFile(tempFilePath);
        await deleteTempFile(outputFilePath);
    }
}

async function execAiOutputCmd(command: string) {
    return new Promise((resolve, reject) => {
        execAsync(command).then((result: any) => {
            resolve(result);
        }).catch((error: any) => {
            reject(error);
        });
    });
}

async function runMoveAi(document: vscode.TextDocument, targetCodeBlock: string, endOfCodeBlockPosition: vscode.Position, cacheKey: string) {
    const workspacePath = getWorkSpacePath();
    let requestData = {
        "messages": [
            {
                "role": "user",
                "content": targetCodeBlock,
            }
        ],
        "show_intermediate_steps": false
    };

    console.log("Sending request to AI...");
    const execAsync = promisify(exec);
    axios.post("http://localhost:3000/api", requestData)
        .then(async (response: { data: string; }) => {
            console.log("AI agent exectuting command: ", response.data);
            const { stdout, stderr } = await execAsync(response.data, {
                cwd: workspacePath,
            });
            console.log("AI agent output: ", stdout + stderr);
            insertOutputIntoMarkdown(document, endOfCodeBlockPosition, stdout + stderr);
            console.log("Wrote output to markdown...");
            setCachedOutput(cacheKey, response.data);
            vscode.window.showInformationMessage("✅ Execution successful!");
        })
        .catch((error: { response: { data: any; }; }) => {
            if (error) {
                vscode.window.showErrorMessage(`❌ Execution error: ${error.response.data}`);
            }
            vscode.window.showErrorMessage(`❌ Execution error: ${error}`);
        });
}