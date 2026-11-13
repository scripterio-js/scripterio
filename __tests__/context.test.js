import { describe, test, expect } from '../src/index.mjs'

const loadFreshContext = async (label) => {
  return import(
    new URL(`../src/core/context.mjs?${label}-${Date.now()}`, import.meta.url)
  )
}

const runWithoutConsoleNoise = async (run) => {
  const originalLog = console.log
  const originalError = console.error
  const originalCurrentTest = global.currentTest

  console.log = () => {}
  console.error = () => {}

  try {
    return await run()
  } finally {
    console.log = originalLog
    console.error = originalError
    global.currentTest = originalCurrentTest
  }
}

describe('Unit tests for context.mjs', () => {
  test('inherits parent describe tags for nested tests', async () => {
    const context = await loadFreshContext('parent-tags')
    const ran = []

    context.describe('outer suite', { tags: ['parent'] }, () => {
      context.describe('inner suite', () => {
        context.test('inherits parent suite tags', () => {
          ran.push('inherits')
        })
      })
    })
    context.describe('untagged suite', () => {
      context.test('should not run without matching tags', () => {
        ran.push('untagged')
      })
    })

    const result = await runWithoutConsoleNoise(() =>
      context.runParsedBlocks(['parent'])
    )

    expect(result.successes).toBeEqual(1)
    expect(result.failures).toHaveLength(0)
    expect(ran).toHaveLength(1)
    expect(ran).toContain('inherits')
    expect(ran.includes('untagged')).toBeFalsy()
  })

  test('preserves explicit test tags alongside inherited describe tags', async () => {
    const context = await loadFreshContext('merged-tags')
    const ran = []

    context.describe('outer suite', { tags: ['parent'] }, () => {
      context.describe('inner suite', { tags: ['child'] }, () => {
        context.test('inherits describe tags', () => {
          ran.push('inherits')
        })
        context.test(
          'merges inherited and explicit tags',
          { tags: ['leaf'] },
          () => {
            ran.push('leaf')
          }
        )
      })
    })

    const result = await runWithoutConsoleNoise(() =>
      context.runParsedBlocks(['leaf'])
    )

    expect(result.successes).toBeEqual(1)
    expect(result.failures).toHaveLength(0)
    expect(ran).toHaveLength(1)
    expect(ran).toContain('leaf')
    expect(ran.includes('inherits')).toBeFalsy()
  })
})
