import path from 'path'
import { transformStackTrace } from '../utils/transform.mjs'
import { runParsedBlocks } from '../core/context.mjs'
import { getTags, getReporterType, chooseTestFiles } from '../config/setup.mjs'
import { timeStamp } from '../utils/support.mjs'
import { EXIT_CODES } from '../core/constants.mjs'
import {
  printExecutionTime,
  printRunningTestFile,
  printTags,
  printFailuresMsg,
  printTestResult,
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
