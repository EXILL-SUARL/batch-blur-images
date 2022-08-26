import sharp from 'sharp'
import { getFileList } from './utils.js'
import isImage from 'is-image'
import path from 'path'

// TODO: implement a dynamic list of supported formats by Sharp once sharp@v0.31.0 gets released: https://github.com/lovell/sharp/issues/2642#issuecomment-1180197850
const supportedFormats = ['jpg', 'jpeg', 'gif', 'webp', 'tif', 'png', 'jpeg']

const blurImage = async (file: string, sigma?: number | boolean) => {
  const fileExt = path.extname(file).substring(1)
  return new Promise(async (resolve, reject) => {
    if (isImage(file) && supportedFormats.includes(fileExt)) {
      await sharp(file)
        .blur(sigma)
        .toBuffer()
        .then((buffer) => {
          sharp(buffer).toFile(file)
        })
        .then(() => resolve(file))
        .catch((err) => reject(err))
    }
  })
}

/**
 * Blurs images in the given directory.
 * @date 8/18/2022 - 8:56:28 AM
 *
 * @param {string} targetDir The path of a directory containing images.
 * @param {(number | boolean)} sigma The value for Sharp's blur sigma parameter: https://sharp.pixelplumbing.com/api-operation#blur.
 * @returns {Promise<unknown>}
 */
const entry = (
  targetDir: string,
  sigma?: number | boolean,
): Promise<unknown> => {
  return new Promise(
    async (resolve, reject) =>
      await Promise.all(
        (await getFileList(targetDir)).map((file) => blurImage(file, sigma)),
      )
        .then((done) => resolve(done))
        .catch((err) => reject(err)),
  )
}

export default entry
