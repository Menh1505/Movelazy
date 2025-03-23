import * as vscode from 'vscode';
import { setLastHoveredMoveLazyPosition } from '../state';

export function registerHoverProvider(context: vscode.ExtensionContext) {
    const hoverDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: "underline",
        backgroundColor: "rgba(255, 255, 0, 0.3)",
    });

    const hoverProvider = vscode.languages.registerHoverProvider("markdown", {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) { return; }
            const word = document.getText(range);

            if (word === "move_lazy") {
                setLastHoveredMoveLazyPosition(position);
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.setDecorations(hoverDecorationType, [range]);
                    setTimeout(() => editor.setDecorations(hoverDecorationType, []), 3000);
                }
                const markdownHover = new vscode.MarkdownString();
                markdownHover.appendMarkdown(`### 🚀 Movelazy\n`);
                markdownHover.appendMarkdown(`🔹 Click to run the code in the block.\n\n`);
                markdownHover.appendMarkdown(`✅ Click **[Here](command:extension.runMoveLazy)** to execute.`);
                return new vscode.Hover(markdownHover, range);
            }
            if (word === "output") {
                const markdownHover = new vscode.MarkdownString();
                markdownHover.appendMarkdown(`🗑 **Click to delete this output**`);
                markdownHover.isTrusted = true;
                return new vscode.Hover(markdownHover, range);
            }
        },
    });

    context.subscriptions.push(hoverProvider);
}