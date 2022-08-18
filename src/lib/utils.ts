import { readdir } from 'fs/promises'

export const getFileList = async (dirName: string) => {
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
