const isDev = __DEV__

export const logger = {
  info(message: string, ...args: unknown[]) {
    if (isDev) console.info(`[INFO] ${message}`, ...args)
  },

  warn(message: string, ...args: unknown[]) {
    if (isDev) console.warn(`[WARN] ${message}`, ...args)
  },

  error(message: string, ...args: unknown[]) {
    if (isDev) console.error(`[ERROR] ${message}`, ...args)
    // TODO: pipe to crash reporting service (e.g. Sentry) in production
  },
}
