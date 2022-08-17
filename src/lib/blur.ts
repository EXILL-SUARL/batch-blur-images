import sharp, { SharpOptions } from 'sharp'
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

export default (target: string, sigma: number | boolean) => {
  // TODO: implement a dynamic list of supported formats by Sharp once sharp@v0.31.0 gets released: https://github.com/lovell/sharp/issues/2642#issuecomment-1180197850
  const supportedFormats = ['jpg', 'jpeg', 'gif', 'webp', 'tif', 'png', 'jpeg']
  getFileList(target).then((files) => {
    files.forEach(async (file) => {
      const fileExt = path.extname(file).substring(1)
      if (isImage(file) && supportedFormats.includes(fileExt)) {
        await sharp(file)
          .blur(sigma)
          .toBuffer()
          .then((buffer) => {
            sharp(buffer).toFile(file)
          })
          .catch((err) => {
            throw err
          })
      }
    })
  })
}
