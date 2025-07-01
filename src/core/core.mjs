import path from 'path'
import { applyColor, transformStackTrace } from '../utils/transform.mjs'
import { runParsedBlocks } from '../core/context.mjs'
import { getTags, getReporterType, chooseTestFiles } from '../config/setup.mjs'
import { timeStamp } from '../utils/support.mjs'
import { EXIT_CODES } from '../core/constants.mjs'
import {
  printExecutionTime,
  printRunningTestFile,
  printNewLine,
  printTags,
} from './output.mjs'
import { getReporter } from '../reporters/index.mjs'

Error.prepareStackTrace = transformStackTrace

export const run = async () => {
  const startTimeStamp = timeStamp()
  const tags = getTags()
  try {
    const testFilePaths = await chooseTestFiles()
    await Promise.all(
      testFilePaths.map(async (testFilePath) => {
        printRunningTestFile(path.resolve(process.cwd(), testFilePath))
        await import(testFilePath)
      })
    )
    tags && printTags(tags)
    const { failures, successes } = await runParsedBlocks(tags)
    const endTimeStamp = timeStamp()
    printFailuresMsg(failures)
    printTestResult(failures, successes)
    printExecutionTime(startTimeStamp, endTimeStamp)
    await getReporter(getReporterType())
    process.exit(failures.length > 0 ? EXIT_CODES.failures : EXIT_CODES.ok)
  } catch (e) {
    console.error(e.message)
    console.error(e.stack)
    process.exit(EXIT_CODES.failures)
  }
}

const createFullDescription = ({ name, describeStack }) =>
  [...describeStack, { name }]
    .map(({ name }) => `<bold>${name}</bold>`)
    .join(' → ')

const printFailureMsg = (failure) => {
  console.error(applyColor(createFullDescription(failure)))
  printNewLine()
  failure.errors.forEach((error) => {
    console.error(error.message)
    console.error(error.stack)
  })
  printNewLine()
}

const printFailuresMsg = (failures) => {
  if (failures.length > 0) {
    printNewLine()
    console.error('Failures:')
    printNewLine()
  }
  failures.forEach(printFailureMsg)
}

const printTestResult = (failures, successes) => {
  printNewLine()
  console.log(
    applyColor(
      `Tests: <green>${successes} passed</green>, ` +
        `<red>${failures.length} failed</red>, ` +
        `${successes + failures.length} total`
    )
  )
}
