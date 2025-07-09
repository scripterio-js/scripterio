import { AssertionError } from '../errors/assertion.mjs'
import { RunnerError } from '../errors/runner.mjs'
import { indentLine } from '../utils/transform.mjs'
import { TYPES } from '../core/constants.mjs'
import { EOL } from 'os'

export const toBeTypeOf = (actual, expected) => {
  if (typeof expected !== 'string') {
    throw new RunnerError(
      indentLine(`Provided type: ${typeof expected} is not a string`)
    )
  }

  if (!(expected in TYPES)) {
    throw new RunnerError(
      indentLine(`Expect type: ${expected} is not a valid type`)
    )
  }

  if (expected === 'array') {
    if (!Array.isArray(actual)) {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has an array type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${Array.isArray(actual) ? 'array' : typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'null') {
    if (actual !== null) {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a null type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${
            actual === undefined
              ? 'undefined'
              : actual === null
              ? 'null'
              : Array.isArray(actual)
              ? 'array'
              : typeof actual
          } type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'string') {
    if (typeof actual !== 'string') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a string type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'number') {
    if (typeof actual !== 'number') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a number type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'boolean') {
    if (typeof actual !== 'boolean') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a boolean type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'object') {
    if (
      typeof actual !== 'object' ||
      actual === null ||
      Array.isArray(actual)
    ) {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has an object type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'function') {
    if (typeof actual !== 'function') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a function type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'undefined') {
    if (typeof actual !== 'undefined') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has an undefined type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'symbol') {
    if (typeof actual !== 'symbol') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a symbol type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  } else if (expected === 'bigint') {
    if (typeof actual !== 'bigint') {
      throw new AssertionError(
        indentLine('Expected: <expected>') +
          ' has a bigint type' +
          EOL +
          indentLine('Received: <actual>') +
          ` has a ${typeof actual} type`,
        {
          actual,
          expected,
        }
      )
    }
  }
}
