/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import {config} from './config'
import {storageBucket} from './storage'

export async function doHealthCheck(): Promise<void> {
  try {
    console.log('GCS Bucket: Checking...')
    await storageBucket.file('health-check.txt').save(new Date().toISOString())
    console.log('GCS Bucket: Healthy')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  try {
    console.log('Image URL: Checking...')
    await checkImage()
    console.log('Image URL: Healthy')
  } catch (err) {
    console.error('Failed to retrieve image from %s', config.imageUrl)
    console.error(err)
    process.exit(1)
  }
}

async function checkImage() {
  const response = await fetch(config.imageUrl)
  if (!response.ok) {
    throw new Error(`Received ${response.status} from ${config.imageUrl}`)
  }

  const type = response.headers.get('content-type')
  if (!type || !type.startsWith('image/')) {
    throw new Error(`Received ${type} from ${config.imageUrl}`)
  }
}

doHealthCheck()
