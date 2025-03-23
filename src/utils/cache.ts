const cache: { [key: string]: string } = {};

export function getCachedOutput(key: string): string | undefined {
    return cache[key];
}

export function setCachedOutput(key: string, output: string): void {
    cache[key] = output;
}