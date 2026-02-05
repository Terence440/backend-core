const path = require("path");
const fs = require('fs');

/**
 * Ensures that the specified directory exists. If the directory structure does not exist, it is created recursively.
 *
 * @param {string} dirPath - The path of the directory to ensure exists.
 * @returns 
 */
const ensureDir = (dirPath) => {
    const resolvedPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, { recursive: true });
    }
    return resolvedPath;
};
exports.ensureDir = ensureDir;

/**
 * Convert base 64 to Buffer type
 * @param {String} base64 
 * @returns ArrayBuffer
 */
const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; // Returns the underlying ArrayBuffer
};
exports.base64ToArrayBuffer = base64ToArrayBuffer;

