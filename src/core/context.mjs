/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
import { TimeoutError } from '../errors/timeout.mjs'
import { focusedOnly } from './focus.mjs'
import {
  applyColor,
  executeAllAndWait,
  withoutLast,
} from '../utils/transform.mjs'
import { printNewLine, printSkippedMsg } from './output.mjs'

export const report = []
const failures = []
let successes = 0
let describeStack = []
let currentDescribe
let hasBeforeAll = false
let hasAfterAll = false
let beforeAllStack = []
let afterAllStack = []
const defaultTimeout = 5_000

const makeDescribe = (name, options) => ({
  ...options,
  name,
  beforeEach: [],
  afterEach: [],
  children: [],
})

const makeTest = (name, body, timeout = defaultTimeout, tags = []) => ({
  name,
  body,
  errors: [],
  timeout: new TimeoutError(timeout),
  tags: Array.isArray(tags) ? tags : [tags],
})

currentDescribe = makeDescribe('root')

export const describe = (name, optionsOrBody, body) => {
  const options = typeof optionsOrBody === 'object' ? optionsOrBody : {}
  const actualBody = typeof optionsOrBody === 'function' ? optionsOrBody : body
  const parentDescribe = currentDescribe
  currentDescribe = makeDescribe(name, options)
  actualBody()
  currentDescribe = {
    ...parentDescribe,
    children: [...parentDescribe.children, currentDescribe],
  }
}

export const test = (name, optionsOrBody, body) => {
  const options = typeof optionsOrBody === 'object' ? optionsOrBody : {}
  const actualBody = typeof optionsOrBody === 'function' ? optionsOrBody : body
  currentDescribe = {
    ...currentDescribe,
    children: [
      ...currentDescribe.children,
      makeTest(name, actualBody, options.timeout, options.tags),
    ],
  }
}

export const skip = (name) => {
  printSkippedMsg(name)
}

export const beforeEach = (body) => {
  currentDescribe = {
    ...currentDescribe,
    beforeEach: [...currentDescribe.beforeEach, body],
  }
}

export const afterEach = (body) => {
  currentDescribe = {
    ...currentDescribe,
    afterEach: [...currentDescribe.afterEach, body],
  }
}

export const beforeAll = (body) => {
  beforeAllStack.push(body)
  hasBeforeAll = true
}

export const afterAll = (body) => {
  afterAllStack.push(body)
  hasAfterAll = true
}

const isTestBlock = (testObject) => testObject.hasOwnProperty('body')

const indent = (message) => `${' '.repeat(describeStack.length * 2)}${message}`

const runDescribe = async (describe) => {
  printNewLine()
  console.log(applyColor(`<bold>${indent(describe.name)}`))
  describeStack = [...describeStack, describe]
  await invokeBeforeAll()
  for (let i = 0; i < describe.children.length; ++i) {
    await runBlock(describe.children[i])
  }
  await invokeAfterAll()
  describeStack = withoutLast(describeStack)
}

const timeoutPromise = () => currentTest.timeout.createTimeoutPromise()

const runBodyAndWait = async (body) => {
  const result = body()
  if (result instanceof Promise) {
    await Promise.race([result, timeoutPromise()])
  }
}

const runTest = async (test) => {
  global.currentTest = test
  currentTest.describeStack = [...describeStack]
  try {
    await invokeBeforeEach(currentTest)
    await runBodyAndWait(currentTest.body)
  } catch (e) {
    currentTest.errors.push(e)
  }
  if (currentTest.errors.length > 0) {
    console.log(indent(applyColor(`<red>✗</red> ${currentTest.name}`)))
    failures.push(currentTest)
  } else {
    successes++
    console.log(indent(applyColor(`<green>✓</green> ${currentTest.name}`)))
  }
  try {
    await invokeAfterEach(currentTest)
  } catch (e) {
    console.error(e)
  }
  report.push(currentTest)
  global.currentTest = null
}

const invokeBeforeEach = async () =>
  executeAllAndWait(describeStack.flatMap((describe) => describe.beforeEach))

const invokeAfterEach = async () =>
  executeAllAndWait(describeStack.flatMap((describe) => describe.afterEach))

const invokeBeforeAll = async () => {
  if (hasBeforeAll) {
    await executeAllAndWait(beforeAllStack)
    hasBeforeAll = false
    beforeAllStack = []
  }
}

const invokeAfterAll = async () => {
  if (hasAfterAll) {
    await executeAllAndWait(afterAllStack)
    hasAfterAll = false
    afterAllStack = []
  }
}

const runBlock = (block) =>
  isTestBlock(block) ? runTest(block) : runDescribe(block)

export const runParsedBlocks = async (tags) => {
  const withFocus = focusedOnly(currentDescribe)

  const filterByTags = (block) => {
    if (isTestBlock(block)) {
      if (!tags || block.tags.some((tag) => tags.includes(tag))) {
        return block
      }
      return null
    }
    return {
      ...block,
      children: block.children.map(filterByTags).filter(Boolean),
    }
  }

  const filteredBlocks = tags ? filterByTags(withFocus) : withFocus

  for (let i = 0; i < filteredBlocks.children.length; ++i) {
    await runBlock(filteredBlocks.children[i])
  }
  return { successes, failures }
}
