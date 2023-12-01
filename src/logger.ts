import createLogger from 'pino'
import {config} from './config.js'

export const logger = createLogger({
  level: config.logLevel,
})

export function getMessageFromError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error}`
  }

  if (typeof error === 'string') {
    return error
  }

  return JSON.stringify(error)
}
