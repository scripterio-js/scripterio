import { describe, test, expect } from '../src/index.mjs'

describe('Unit tests for assertions', () => {
  test('Check assertion toBeDefined()', () => {
    const number = 1
    expect(number).toBeDefined()
  })

  test('Check assertion toHaveLength()', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
  })

  test('Check assertion toBeFalsy()', () => {
    const flag = false
    expect(flag).toBeFalsy()
  })

  test('Check assertion toBeTruthy()', () => {
    const flag = true
    expect(flag).toBeTruthy()
  })

  test('Check assertion toEqual()', () => {
    expect(1).toBeEqual(1)
    expect('test').toBeEqual('test')
    expect(true).toBeEqual(true)
    expect(false).toBeEqual(false)
  })

  test('Check assertion notToEqual()', () => {
    expect(2).toBeNotEqual(1)
    expect('best').toBeNotEqual('test')
    expect(false).toBeNotEqual(true)
    expect({}).toBeNotEqual({})
    expect([]).toBeNotEqual([])
  })

  test('Wait 1 sec and check (async)', { timeout: 2000 }, async () => {
    const number = await new Promise((resolve) =>
      setTimeout(() => resolve(1), 1_000)
    )
    expect(number).toBeDefined()
  })

  test('Check assertion toBeNull()', () => {
    expect(null).toBeNull()
  })

  test('Check assertion notToBeNull()', () => {
    expect(1).toBeNotNull()
  })

  test('Check assertion toBeUndefined()', () => {
    expect(undefined).toBeUndefined()
  })

  test('Check assertion toBeGreaterThan()', () => {
    expect(5).toBeGreaterThan(4)
  })

  test('Check assertion toBeLessThan()', () => {
    expect(3).toBeLessThan(4)
  })

  test('Check assertion toBeNaN()', () => {
    expect('10F').toBeNaN()
  })

  test('Check assertion toContain()', () => {
    const arr = ['real', 'test']
    expect(arr).toContain('test')
    expect(arr[0]).toContain('al')
  })

  test('Check assertion toMatch()', () => {
    expect('test').toMatch('test')
    expect('test').toMatch(/test/i)
  })
})
