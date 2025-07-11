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
import { getConfig } from '../config/config.mjs'
import { timeStamp } from '../utils/support.mjs'

const config = getConfig()
const failures = []
const defaultTimeout = config.timeout || 5_000
let successes = 0
let describeStack = []
let currentDescribe
let hasBeforeAll = false
let hasAfterAll = false
let beforeAllStack = []
let afterAllStack = []

export const result = {
  numTests: 0,
  numPassed: 0,
  numFailed: 0,
  numTodo: 0,
  results: [],
}

const makeDescribe = (name, options) => ({
  ...options,
  name,
  beforeEach: [],
  afterEach: [],
  children: [],
})

const makeTest = (name, body, timeout = defaultTimeout, tags = [], retry) => ({
  name,
  body,
  errors: [],
  timeout: new TimeoutError(timeout),
  tags: Array.isArray(tags) ? tags : [tags],
  retry: retry || config.retry,
})

currentDescribe = makeDescribe('root')

const handleDescribe = (name, optionsOrBody, body, extra = {}) => {
  const options = typeof optionsOrBody === 'object' ? optionsOrBody : {}
  const actualBody = typeof optionsOrBody === 'function' ? optionsOrBody : body
  const parentDescribe = currentDescribe
  currentDescribe = makeDescribe(name, { ...options, ...extra })
  if (!extra.todo) actualBody?.()
  currentDescribe = {
    ...parentDescribe,
    children: [...parentDescribe.children, currentDescribe],
  }
}

export const describe = (name, optionsOrBody, body) => {
  handleDescribe(name, optionsOrBody, body)
}

describe.only = (name, optionsOrBody, body) => {
  handleDescribe(name, optionsOrBody, body, { focus: true })
}
describe.todo = (name, optionsOrBody, body) => {
  handleDescribe(name, optionsOrBody, body, { todo: true })
}

const handleTest = (name, optionsOrBody, body, extra = {}) => {
  const options = typeof optionsOrBody === 'object' ? optionsOrBody : {}
  const actualBody = typeof optionsOrBody === 'function' ? optionsOrBody : body
  currentDescribe = {
    ...currentDescribe,
    children: [
      ...currentDescribe.children,
      {
        ...makeTest(
          name,
          extra.todo ? () => {} : actualBody,
          options.timeout,
          options.tags,
          options.retry
        ),
        ...extra,
      },
    ],
  }
}

export const test = (name, optionsOrBody, body) => {
  handleTest(name, optionsOrBody, body)
}

test.only = (name, optionsOrBody, body) => {
  handleTest(name, optionsOrBody, body, { focus: true })
}
test.todo = (name, optionsOrBody, body) => {
  handleTest(name, optionsOrBody, body, { todo: true })
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
  let attempts = 0
  const maxRetries = test.retry || 0
  let passed = false
  global.currentTest = test
  currentTest.describeStack = [...describeStack]

  const startTimeStamp = timeStamp()
  if (test.todo) {
    result.numTodo++
    result.numTests++
    console.log(
      indent(applyColor(`<yellow>◦</yellow> ${currentTest.name} (TODO)`))
    )
  }

  while (attempts <= maxRetries && !passed) {
    if (attempts > 0) {
      console.log(
        indent(
          applyColor(
            `<yellow>↻ Retry #${attempts}</yellow> ${currentTest.name}`
          )
        )
      )
      currentTest.errors = []
    }
    try {
      await invokeBeforeEach(currentTest)
      await runBodyAndWait(currentTest.body)
    } catch (e) {
      currentTest.errors.push(e)
    }
    passed = currentTest.errors.length === 0
    try {
      await invokeAfterEach(currentTest)
    } catch (e) {
      console.error(e)
    }
    attempts++
  }

  const endTimeStamp = timeStamp()
  if (!passed) {
    result.numFailed++
    console.log(indent(applyColor(`<red>✗</red> ${currentTest.name}`)))
    failures.push(currentTest)
  } else {
    successes++
    result.numPassed++
    console.log(indent(applyColor(`<green>✓</green> ${currentTest.name}`)))
  }
  result.numTests++
  result.results.push(currentTest)
  currentTest.duration = endTimeStamp - startTimeStamp
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
