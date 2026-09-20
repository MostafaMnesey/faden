/**
 * Minimal structured logger with file logging support.
 */
import fs from "fs";
import path from "path";
import type { Levels } from "../Types/logger.js";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const stripAnsi = (str: string): string =>
  str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

export const writeToFile = (text: string): void => {
  try {
    const cleanText = stripAnsi(text);
    fs.appendFileSync(LOG_FILE, cleanText + "\n", "utf8");
  } catch (err) {
    if (err instanceof Error) {
      process.stderr.write(`Failed to write log to file: ${err.message}\n`);
    }
  }
};

const levels: Levels = { error: 0, warn: 1, info: 2, debug: 3 };
const logEnv = process.env.LOG_LEVEL || "info";
const currentLevel = levels[logEnv] ?? levels.info;

const format = (level: string, message: string, meta?: unknown): string => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

let insideLogger = false;

const log = (level: string, message: string, meta?: unknown): void => {
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

console.log = (...args: unknown[]): void => {
  originalLog(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [LOG] ${text}`);
  }
};

console.error = (...args: unknown[]): void => {
  originalError(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [ERROR] ${text}`);
  }
};

console.warn = (...args: unknown[]): void => {
  originalWarn(...args);
  if (!insideLogger) {
    const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const ts = new Date().toISOString();
    writeToFile(`[${ts}] [WARN] ${text}`);
  }
};

export const logger = {
  error: (msg: string, meta?: unknown): void => log("error", msg, meta),
  warn:  (msg: string, meta?: unknown): void => log("warn",  msg, meta),
  info:  (msg: string, meta?: unknown): void => log("info",  msg, meta),
  debug: (msg: string, meta?: unknown): void => log("debug", msg, meta),
};
