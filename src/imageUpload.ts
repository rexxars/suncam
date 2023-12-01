import {fetch} from 'undici'
import {getMessageFromError, logger} from './logger'
import {config} from './config'
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
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const formattedMonth = month < 10 ? `0${month}` : `${month}`
  const formattedDay = day < 10 ? `0${day}` : `${day}`

  return `${year}-${formattedMonth}/${formattedDay}-${event}.jpg`
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
