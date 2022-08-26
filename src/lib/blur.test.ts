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
    .then((buffer) => {
      fs.promises.writeFile(`${tempDir}/${uuidv4()}.jpg`, buffer.data)
    })
    .catch((err) => {
      throw err
    })

test.before(async (t) => {
  t.timeout(120000)
  try {
    await mkdirp(tempDir)
    Array.from(Array(10)).forEach(async () => await getImage())
  } catch (err) {
    throw err
  }
})

test.after.always((t) => fs.promises.rm(tempDir, { recursive: true }))

test(`The promise resolves with the same amount of files as the source`, async (t) => {
  t.plan(1)
  const totalRuns = (await getFileList(tempDir)).length
  await blur(tempDir, 5).then(({ length }: { length: number }) =>
    t.is(length, totalRuns),
  )
})
