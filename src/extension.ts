import * as vscode from 'vscode';
import { ViewProvider } from './providers/ViewProvider';
import { registerCommands } from './commands';
import { registerHoverProvider } from './providers/hoverProvider';
import { registerLinkProvider } from './providers/linkProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "movelazy" is now active!');

    const provider = new ViewProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ViewProvider.viewType, provider));

    registerHoverProvider(context);
    registerLinkProvider(context);
    registerCommands(context);
}

export function deactivate() {
    console.log('Your extension "movelazy" is now deactivated!');
}