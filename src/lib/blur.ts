import sharp from 'sharp'
import { getFileList, error } from './utils.js'
import isImage from 'is-image'
import path from 'path'

// TODO: implement a dynamic list of supported formats by Sharp once sharp@v0.31.0 gets released: https://github.com/lovell/sharp/issues/2642#issuecomment-1180197850
const supportedFormats = ['jpg', 'jpeg', 'gif', 'webp', 'tif', 'png', 'jpeg']

const blurImage = async (file: string, sigma?: number | boolean) => {
  const fileExt = path.extname(file).substring(1)
  return new Promise(async (resolve, reject) => {
    try {
      if (!isImage(file)) reject(error(`${file} is not an image!`))
      if (!supportedFormats.includes(fileExt))
        reject(error(`${file} image format is not supported by Sharp`))
      const blurredBuffer = await sharp(file).blur(sigma).toBuffer()
      await sharp(blurredBuffer).toFile(file)
      resolve(file)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Blurs images in the given directory.
 * @date 8/27/2022 - 1:55:06 PM
 *
 * @async
 * @param {string} targetDir The path of a directory containing images.
 * @param {?(number | boolean)} [sigma] The value for Sharp's blur sigma parameter: https://sharp.pixelplumbing.com/api-operation#blur.
 * @returns {Promise<PromiseSettledResult<unknown>[]>}
 */
const entry = async (targetDir: string, sigma?: number | boolean) => {
  try {
    const fileList = await getFileList(targetDir)
    return Promise.allSettled(
      fileList.map(async (file) => blurImage(file, sigma)),
    )
  } catch (err) {
    error(err)
  }
}

export default entry
