import {find} from 'geo-tz'
import {fetch} from 'undici'
import {config} from './config'
import {getMessageFromError, logger} from './logger'
import {storageBucket} from './storage'

const imageUrl = config.imageUrl

export async function fetchAndUploadImage(
  event: 'sunrise' | 'sunset' | 'solarNoon',
): Promise<void> {
  let attempts = 0

  const upload = async () => {
    try {
      const now = new Date()
      const fileName = formatFileName(now, event)
      const imageBuffer = await retrieveImage(imageUrl)

      await uploadImageToGCS(imageBuffer, fileName)
    } catch (error) {
      if (attempts < 3) {
        attempts++
        setTimeout(upload, 60000) // Retry after 1 minute
      } else {
        logger.error(
          `Failed to upload image after ${attempts} attempts for ${event}:`,
          error,
        )
      }
    }
  }

  await upload()
}

function formatFileName(date: Date, event: string): string {
  const [timeZone] = find(config.latitude, config.longitude)
  const {year, month, day} = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone,
  })
    .formatToParts(date)
    .reduce(
      (acc, part) => {
        acc[part.type] = part.value
        return acc
      },
      {} as {[key: string]: string},
    )

  return `${year}-${month}/${day}-${event}.jpg`
}

async function uploadImageToGCS(
  imageBuffer: Buffer,
  fileName: string,
): Promise<void> {
  const file = storageBucket.file(fileName)
  const options = {
    metadata: {
      contentType: 'image/jpeg',
    },
  }

  try {
    await file.save(imageBuffer, options)
    logger.info(`${fileName} uploaded to GCS.`)
  } catch (error) {
    logger.error('Error uploading to GCS: %s', getMessageFromError(error))
    throw error
  }
}

async function retrieveImage(url: string): Promise<Buffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
