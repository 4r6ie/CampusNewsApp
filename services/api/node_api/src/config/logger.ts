export interface AppLogger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

export const logger: AppLogger = {
  info: (message, meta) => {
    console.log(JSON.stringify({ level: 'info', message, meta, ts: new Date().toISOString() }));
  },
  warn: (message, meta) => {
    console.warn(JSON.stringify({ level: 'warn', message, meta, ts: new Date().toISOString() }));
  },
  error: (message, meta) => {
    console.error(JSON.stringify({ level: 'error', message, meta, ts: new Date().toISOString() }));
  },
};