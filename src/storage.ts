import {Storage} from '@google-cloud/storage'
import {config} from './config'

const storage = new Storage({
  projectId: config.gcs.projectId,
  keyFilename: config.gcs.keyFile,
})

export const storageBucket = storage.bucket(config.gcs.bucketName)
