const fs = require('fs');
const path = require('path');

const { getFormattedDate } = require('./date');
const { ensureDir } = require('./file');
const { trimString } = require('./str');

let logDir = null;

/**
 * Initializes the logger by setting the log directory.
 * If the specified folder path does not exist, it creates the directory recursively.
 * Default: Create a folder, named 'errs' at the current working directory.
 *
 * @param {string} [folderPath] - Optional path to the log directory.
 */
const initLogger = (folderPath) => {
    logDir = folderPath || path.join(process.cwd(), 'errs');
    ensureDir(logDir);
};

/**
 * Writes the provided content to a log file. If the file does not exist, it is created.
 * The log file is named using the provided filename or the current date if no filename is given.
 *
 * @param {string} content - The content to write to the log file.
 * @param {string} [filename] - Optional. The name of the log file (without extension). If not provided, the current date is used.
 * @throws {Error} If the logger has not been initialized (logDir is undefined).
 */
const writeToFile = (content, filename) => {
    if (!logDir) {
        throw new Error('Logger not initialized. Call initLogger() first.');
    }
    const fileName = `${filename || getFormattedDate()}.txt`;
    const filePath = path.join(logDir, fileName);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', { flag: 'wx' });
        // Optionally log file creation
    }

    fs.appendFileSync(filePath, content + '\n');
};

/**
 * Logs a message to a file, optionally within a specified subfolder.
 *
 * @param {string} msg - The message to log.
 * @param {string} filename - The name of the file to write the log to.
 * @param {Object} [options={}] - Optional settings.
 * @param {string} [options.folder] - Subfolder within the log directory to store the log file.
 * @throws {Error} If the logger has not been initialized.
 */
const logInFile = (msg, filename, options = {}) => {
    if (!logDir) {
        throw new Error('Logger not initialized. Call initLogger() first.');
    }
    let filenameWFolder = filename;
    if (options.folder) {
        const newDir = path.join(logDir, `${options.folder}`);
        ensureDir(newDir);
        filenameWFolder = `${options.folder}/${filename}`;
    }
    writeToFile(`[${new Date().toISOString()}]  ${msg}`, filenameWFolder);
};

/**
 * Logs a message with a timestamp to a file.
 *
 * @param {string} msg - The message to log.
 */
const log = (msg) => {
    writeToFile(`[${new Date().toISOString()}]  ${msg}`);
};

/**
 * Used in logging purpose, trim long values
 * Used it if the logging is lengthy and not important
 * @param {*} logs - logs to format
 * @param {Array} skipKey - keys to skip trimming
 * @returns formatted logs
 */
const formatLogs = (logs, skipKey = []) => {
  if (typeof logs === 'string') return trimString(logs);
  if (Array.isArray(logs)) {
    return logs.map(log => this.formatLogs(log, skipKey));
  }
  if (typeof logs === 'object' && logs !== null) {
    const formattedObj = {};
    for (const key in logs) {
      if (skipKey.includes(key)) {
        formattedObj[key] = logs[key];
        continue;
      }
      if (typeof logs[key] === 'object' && logs[key] !== null) {
        formattedObj[key] = this.formatLogs(logs[key], skipKey);
      } else {
        if (typeof logs[key] === 'string') {
          formattedObj[key] = trimString(logs[key]);
        } else {
          formattedObj[key] = logs[key];
        }
      }
    }
    return formattedObj;
  }
}

module.exports = {
    initLogger,
    logInFile,
    log,
    formatLogs,
};
