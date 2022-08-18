import sharp from 'sharp'
import { readdir } from 'fs/promises'
import isImage from 'is-image'
import path from 'path'

const getFileList = async (dirName: string) => {
  let files: string[] = []
  const items = await readdir(dirName, { withFileTypes: true })
  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))]
    } else {
      files.push(`${dirName}/${item.name}`)
    }
  }
  return files
}

const entry =
  /**
   * Specify the path of a directory (containing images) and a value for Sharp's blur sigma parameter: https://sharp.pixelplumbing.com/api-operation#blur
   * @date 8/18/2022 - 8:56:28 AM
   *
   * @param {string} targetDir
   * @param {(number | boolean)} sigma
   * @returns {*}
   */
  (targetDir: string, sigma: number | boolean) => {
    return new Promise(function (resolve, reject) {
      getFileList(targetDir).then((files) => {
        try {
          files.forEach(async (file) => {
            // TODO: implement a dynamic list of supported formats by Sharp once sharp@v0.31.0 gets released: https://github.com/lovell/sharp/issues/2642#issuecomment-1180197850
            const supportedFormats = [
              'jpg',
              'jpeg',
              'gif',
              'webp',
              'tif',
              'png',
              'jpeg',
            ]
            const fileExt = path.extname(file).substring(1)
            if (isImage(file) && supportedFormats.includes(fileExt)) {
              try {
                await sharp(file)
                  .blur(sigma)
                  .toBuffer()
                  .then((buffer) => {
                    sharp(buffer).toFile(file)
                  })
              } catch (err) {
                throw err
              }
            }
          })

          resolve(files.length)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

export default entry
