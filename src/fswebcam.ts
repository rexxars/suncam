import {execFileSync} from 'node:child_process'

import {config} from './config'

export function getPhotoFromWebCam(): Buffer {
  return execFileSync('fswebcam', getArgsFromConfig())
}

function getArgsFromConfig() {
  const args: string[] = ['--quiet']
  if (config.fswebcam.device) {
    args.push('--device', config.fswebcam.device)
  }

  if (config.fswebcam.skip) {
    args.push('--skip', `${config.fswebcam.skip}`)
  }

  if (config.fswebcam.delay) {
    args.push('--delay', `${config.fswebcam.delay}`)
  }

  if (config.fswebcam.jpeg) {
    args.push('--jpeg', `${config.fswebcam.jpeg}`)
  }

  if (config.fswebcam.rotate && config.fswebcam.rotate % 90 === 0) {
    args.push('--rotate', `${config.fswebcam.rotate}`)
  }

  if (config.fswebcam.flip.length > 0) {
    args.push('--flip', config.fswebcam.flip.join(','))
  }

  return [...args, '-'] // stdout
}
