/* eslint-disable no-process-env */
export const config = {
  logLevel: process.env['LOG_LEVEL'] || 'info',
  latitude: floatVal(process.env['LATITUDE'], 37.8715),
  longitude: floatVal(process.env['LONGITUDE'], -122.273),
  secondOffset: intVal(process.env['SECOND_OFFSET'], 0),

  gcs: {
    projectId: process.env['GCS_PROJECT_ID'] || 'a-realm-of-ice-and-fire',
    bucketName: process.env['GCS_BUCKET_NAME'] || 'sunrise-sunset-images',
    keyFile: process.env['GCS_KEY_FILE_PATH'] || './keyfile.json',
  },

  fswebcam: {
    device: process.env['FSWEBCAM_DEVICE'] || '',
    resolution: process.env['FSWEBCAM_RESOLUTION'] || '1920x1080',
    skip: intVal(process.env['FSWEBCAM_SKIP'], 60),
    delay: intVal(process.env['FSWEBCAM_DELAY'], 1),
    banner: boolVal(process.env['FSWEBCAM_BANNER'], false),
    jpeg: intVal(process.env['FSWEBCAM_JPEG'], 90),
    rotate: intVal(process.env['FSWEBCAM_ROTATE'], 0),
    flip: (process.env['FSWEBCAM_FLIP'] || '')
      .split(',')
      .filter((dir) => ['h', 'v'].includes(dir)),
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

function boolVal(val: string | undefined, defaultValue: boolean): boolean {
  if (val === undefined) {
    return defaultValue
  }

  switch (val.toLowerCase()) {
    case 'true':
    case 'yes':
    case '1':
      return true
    case 'false':
    case 'no':
    case '0':
      return false
    default:
      return defaultValue
  }
}
