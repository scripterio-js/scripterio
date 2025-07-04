import { describe, test, expect } from '../src/index.mjs'
import { chooseTestFiles } from '../src/config/setup.mjs'

describe('Unit tests for setup.mjs', async () => {
  test('Check chooseTestFiles() returns correct path/s', async () => {
    const filePaths = await chooseTestFiles()
    expect(filePaths).toBeDefined()
    expect(filePaths.length).toBeGreaterThan(1)
  })
})
