import * as vscode from 'vscode';

export function registerLinkProvider(context: vscode.ExtensionContext) {
    const linkProvider = vscode.languages.registerDocumentLinkProvider("markdown", {
        provideDocumentLinks(document) {
            const text = document.getText();
            const links: vscode.DocumentLink[] = [];
            const movelazyRegex = /move_lazy/g;
            let match;
            while ((match = movelazyRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                links.push(new vscode.DocumentLink(new vscode.Range(startPos, endPos), vscode.Uri.parse("command:extension.runMoveLazy")));
            }

            const outputRegex = /```output/g;
            while ((match = outputRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                links.push(new vscode.DocumentLink(new vscode.Range(startPos, endPos), vscode.Uri.parse("command:extension.removeOutput")));
            }

            return links;
        },
    });

    context.subscriptions.push(linkProvider);
}