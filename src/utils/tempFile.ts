import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export function getTempFilePath(extension: string): string {
    const uniqueId = crypto.randomBytes(8).toString('hex');
    return path.join(os.tmpdir(), `lazycode-${uniqueId}.${extension}`);
}

export async function deleteTempFile(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (err) {
        console.error(`❌ Error deleting file: ${filePath}`, err);
    }
}