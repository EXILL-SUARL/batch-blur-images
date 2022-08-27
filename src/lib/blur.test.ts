import blur from './blur.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import mkdirp from 'mkdirp'
import axios from 'axios'
import test from 'ava'

const tempDir = './test-temp'

const getImage = () =>
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
    for (let index = 0; index < 10; index++) {
      await getImage()
    }
  } catch (err) {
    throw err
  }
})

test.after.always((t) => fs.promises.rm(tempDir, { recursive: true }))

test(`The iterable of promises are all fulfilled`, async (t) => {
  t.plan(1)
  await blur(tempDir, 5).then(
    (all: { status: string; reason?: any; rejected?: Error }[]) => {
      const rejectedList = all.filter((result) => result.status === 'rejected')
      t.is(rejectedList.length, 0)
    },
  )
})
