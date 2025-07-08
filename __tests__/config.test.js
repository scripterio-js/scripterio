import { describe, test, expect } from '../src/index.mjs'
import { getConfig } from '../src/config/config.mjs'

describe('Unit tests for config.mjs', () => {
  test('Check getConfig() returns correct configuration', () => {
    const config = getConfig()
    expect(config).toBeDefined()
    expect(config.folder).toBeEqual('__tests__')
    expect(config.reporter).toBeEqual('html')
    expect(config.file).toBeEqual('')
    expect(config.retry).toBeEqual('')
    expect(config.timeout).toBeEqual('')
  })
})
