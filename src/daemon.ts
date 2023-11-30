import {fetchAndUploadImage} from './imageUpload.js'
import {getSunTimes} from './sunTimes.js'
import {config} from './config.js'
import {logger} from './logger.js'

scheduleTasks()
  .then(() => {
    logger.info('Tasks scheduled')
  })
  .catch((err) => {
    logger.error('Error in scheduling tasks: %s', err.message)
  })

async function scheduleTasks(date: Date = new Date()) {
  logger.info('Scheduling tasks for %s', date.toISOString().slice(0, 10))

  try {
    const {sunrise, sunset, solarNoon} = await getSunTimes(
      config.latitude,
      config.longitude,
      date,
    )

    const sunriseOffset = config.secondOffset
    const sunriseMs = calculateTimeout(sunrise, sunriseOffset)
    logger.info('Sunrise at %s (in %s)', sunrise, formatMs(sunriseMs))
    schedule(() => fetchAndUploadImage('sunrise'), sunriseMs)

    const solarNoonMs = calculateTimeout(solarNoon)
    logger.info('Solar noon at %s (in %s)', solarNoon, formatMs(solarNoonMs))
    schedule(() => fetchAndUploadImage('solarNoon'), solarNoonMs)

    const sunsetOffset = 0 - config.secondOffset
    const sunsetMs = calculateTimeout(sunset, sunsetOffset)
    logger.info('Sunset at %s (in %s)', sunset, formatMs(sunsetMs))
    schedule(() => fetchAndUploadImage('sunset'), sunsetMs)

    // Schedule for the next day
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)

    // Do another scheduling 30 minutes after sunset
    const nextScheduleMs = calculateTimeout(sunset) + 30 * 60 * 1000
    schedule(() => scheduleTasks(nextDay), nextScheduleMs)
  } catch (error) {
    logger.error('Error in scheduling tasks:', error)
  }
}

function schedule(fn: () => any, timeoutMs: number) {
  if (timeoutMs < 0) {
    return
  }

  setTimeout(fn, timeoutMs)
}

function calculateTimeout(targetTimeUTC: string, secondOffset = 0): number {
  const now = new Date()
  const targetDate = new Date(targetTimeUTC)

  const nowUTC = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  )

  const targetUTC = Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    targetDate.getHours(),
    targetDate.getMinutes(),
    targetDate.getSeconds(),
  )

  const msOffset = secondOffset * 1000
  return targetUTC + msOffset - nowUTC
}

function formatMs(numMs: number): string {
  let ms = numMs
  if (ms < 0) {
    throw new Error('Milliseconds cannot be negative')
  }

  const msPerSecond = 1000
  const msPerMinute = msPerSecond * 60
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24

  const days = Math.floor(ms / msPerDay)
  ms -= days * msPerDay
  const hours = Math.floor(ms / msPerHour)
  ms -= hours * msPerHour
  const minutes = Math.floor(ms / msPerMinute)
  ms -= minutes * msPerMinute
  const seconds = Math.floor(ms / msPerSecond)

  let timeString = ''
  if (days > 0) timeString += `${days}d `
  if (hours > 0) timeString += `${hours}h `
  if (minutes > 0) timeString += `${minutes}m `
  if (seconds > 0) timeString += `${seconds}s`

  return timeString.trim()
}
