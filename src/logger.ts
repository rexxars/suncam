import createLogger from 'pino'
import {config} from './config.js'

export const logger = createLogger({
  level: config.logLevel,
})
