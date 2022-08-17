import blur from './blur.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import got from 'got'
import mkdirp from 'mkdirp'

const tempDir = './jest-temp'

beforeAll(async () => {
  await mkdirp(tempDir).then(async () => {
    for (let index = 0; index < 7; index++) {
      await got({ url: `http://placekitten.com/200/300` })
        .buffer()
        .then(async (buffer) => {
          await fs.writeFile(`./jest-temp/${uuidv4()}.jpg`, buffer)
        })
    }
  })
})

afterAll(async () => {
  await fs.rm(tempDir, { recursive: true, force: true })
})

test(`The promise rejects`, async () => {
  expect(await blur(tempDir, 5)).toEqual(
    (await fs.readdir(tempDir).then((list) => list)).length,
  )
})
