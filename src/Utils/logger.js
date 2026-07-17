/**
 * Minimal structured logger with file logging support.
 */
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const stripAnsi = (str) =>
  str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

export const writeToFile = (text) => {
  try {
    const cleanText = stripAnsi(text);
    fs.appendFileSync(LOG_FILE, cleanText + "\n", "utf8");
  } catch (err) {
    process.stderr.write(`Failed to write log to file: ${err.message}\n`);
  }
};

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] ?? levels.info;

const format = (level, message, meta) => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

let insideLogger = false;

const log = (level, message, meta) => {
  if (levels[level] <= currentLevel) {
    const output = format(level, message, meta);
    insideLogger = true;
    try {
      if (level === "error") {
        console.error(output);
      } else {
        console.log(output);
      }
      writeToFile(output);
    } finally {
      insideLogger = false;
    }
  }
};

// Override default console logs to capture output from other parts of the app
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  originalLog(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [LOG] ${text}`);
  }
};

console.error = (...args) => {
  originalError(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [ERROR] ${text}`);
  }
};

console.warn = (...args) => {
  originalWarn(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [WARN] ${text}`);
  }
};

export const logger = {
  error: (msg, meta) => log("error", msg, meta),
  warn:  (msg, meta) => log("warn",  msg, meta),
  info:  (msg, meta) => log("info",  msg, meta),
  debug: (msg, meta) => log("debug", msg, meta),
};
