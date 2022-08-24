import blur from './blur.js'
import { getFileList } from './utils.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import mkdirp from 'mkdirp'
import axios from 'axios'
import test from 'ava'

const tempDir = './test-temp'

const getImage = async () =>
  axios
    .get('https://picsum.photos/240', {
      responseType: 'arraybuffer',
    })
    .then(async (buffer) => {
      await fs.promises.writeFile(`${tempDir}/${uuidv4()}.jpg`, buffer.data)
    })
    .catch((err) => {
      throw err
    })

test.before(async (t) => {
  t.timeout(120000)
  return new Promise(async (resolve, reject) => {
    try {
      await mkdirp(tempDir)
      Promise.all(Array.from(Array(10)).map(async () => await getImage())).then(
        (item: any) => resolve(item),
      )
    } catch (err) {
      reject(err)
    }
  })
})

test.after(async (t) => {
  return fs.promises.rm(tempDir, { recursive: true, force: true })
})

test(`The promise resolves with the same amount of files as the source`, async (t) => {
  t.plan(1)
  const totalRuns = (await getFileList(tempDir)).length
  return blur(tempDir, 5).then(({ length }: { length: number }) =>
    t.is(length, totalRuns),
  )
})
