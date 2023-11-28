/* eslint-disable no-process-env */
export const config = {
  logLevel: process.env['LOG_LEVEL'] || 'info',
  latitude: floatVal(process.env.LATITUDE, 37.8715),
  longitude: floatVal(process.env.LONGITUDE, -122.273),
  secondOffset: intVal(process.env.SECOND_OFFSET, 0),
  imageUrl: process.env['IMAGE_URL'] || 'https://www.example.com/image.jpg',

  gcs: {
    projectId: process.env['GCS_PROJECT_ID'] || 'a-realm-of-ice-and-fire',
    bucketName: process.env['GCS_BUCKET_NAME'] || 'sunrise-sunset-images',
    keyFile: process.env['GCS_KEY_FILE_PATH'] || './keyfile.json',
  },
}

function intVal(val: string | undefined, defaultValue: number): number {
  const num = typeof val === 'string' ? parseInt(val, 10) : defaultValue
  return isNaN(num) ? defaultValue : num
}

function floatVal(val: string | undefined, defaultValue: number): number {
  const num = typeof val === 'string' ? parseFloat(val) : defaultValue
  return isNaN(num) ? defaultValue : num
}
