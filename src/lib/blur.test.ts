import blur from './blur.js'
import { getFileList } from './utils.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import mkdirp from 'mkdirp'
import axios from 'axios'

const tempDir = './jest-temp'

const getImage = async () =>
  axios
    .get('https://picsum.photos/240', {
      responseType: 'arraybuffer',
    })
    .then(async (buffer) => {
      await fs.promises.writeFile(`./jest-temp/${uuidv4()}.jpg`, buffer.data)
    })
    .catch((err) => {
      throw err
    })

beforeAll(() => {
  return new Promise(async (resolve, reject) => {
    try {
      await mkdirp(tempDir)
      Promise.all(Array.from(Array(7)).map(async () => await getImage())).then(
        (item) => resolve(item),
      )
    } catch (err) {
      reject(err)
    }
  })
})

afterAll(async () => {
  return fs.promises.rm(tempDir, { recursive: true, force: true })
})

test(`The promise resolves with the same amount of files as the source`, async () => {
  expect.assertions(1)
  const totalRuns = (await getFileList(tempDir)).length
  return expect(blur(tempDir, 5)).resolves.toHaveLength(totalRuns)
})
