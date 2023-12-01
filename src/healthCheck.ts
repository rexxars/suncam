/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import {config} from './config'
import {retrieveImage} from './imageUpload'
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
    await retrieveImage(config.imageUrl)
    console.log('Image URL: Healthy')
  } catch (err) {
    console.error('Failed to retrieve image from %s', config.imageUrl)
    console.error(err)
    process.exit(1)
  }
}

doHealthCheck()
