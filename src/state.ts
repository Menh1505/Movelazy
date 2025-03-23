import * as vscode from 'vscode';

export let lastHoveredMoveLazyPosition: vscode.Position | null = null;

export function setLastHoveredMoveLazyPosition(position: vscode.Position | null) {
    lastHoveredMoveLazyPosition = position;
}