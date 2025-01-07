/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import {getPhotoFromWebCam} from './fswebcam'
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
    console.log('Image: Checking...')
    await checkImage()
    console.log('Image: Healthy')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

async function checkImage() {
  try {
    await getPhotoFromWebCam()
  } catch (err) {
    const msg = err instanceof Error ? err.message : `${err}`
    throw new Error(`Failed to get image from webcam: ${msg}`)
  }
}

doHealthCheck()
