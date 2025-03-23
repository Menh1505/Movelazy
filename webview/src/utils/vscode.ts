import { SolidityMessage } from '../sol/types/messages';
import { AptosMessage } from '../aptos/types/messages';

export interface VSCodeApi {
    postMessage(message: AptosMessage | SolidityMessage): void;
}

// Example function to log VSCode API usage
export function logPostMessage(message: AptosMessage) {
    console.log("Posting message to VSCode:", message);
}