import { EOL } from 'os'
import { ARGS } from './constants.mjs'
import { applyColor } from '../utils/transform.mjs'

export const printHelp = () => {
  console.log(
    'Available CLI options:' +
      EOL +
      '' +
      EOL +
      `${ARGS.FILE}        <path>   Path to a test file (e.g., test.js)` +
      EOL +
      `${ARGS.FOLDER}      <path>   Path to a tests directory (e.g., tests/)` +
      EOL +
      `${ARGS.TAGS}        <tags>   Comma-separated tags to filter tests (e.g., unit,smoke)` +
      EOL +
      `${ARGS.REPORTER}    <type>   Reporter type (e.g., html, console)` +
      EOL +
      `${ARGS.RETRY}       <num>    Number of retries for failed tests (e.g., 2)` +
      EOL +
      `${ARGS.TIMEOUT}     <ms>     Timeout for a test in milliseconds (e.g., 5000)` +
      EOL +
      '' +
      EOL +
      `${ARGS.HELP}                 Display this help message` +
      EOL +
      ''
  )
  process.exit(1)
}

export const printError = (arg) => {
  console.error(
    applyColor(`<red>Error: unknown option: ${arg.replace(/=.*$/, '=')}</red>`)
  )
  console.error('Usage: npx scripterio <option>' + EOL)
  printHelp()
}

export const printSkippedMsg = (name) =>
  console.log(applyColor(`<cyan>Skipped test:</cyan> ${name}`))

export const printExecutionTime = (start, end) => {
  console.log(`Time:  ${end - start} ms`)
}

export const printRunningTestFile = (testFile) => {
  console.log(applyColor(`Running test file: <yellow>${testFile}</yellow>`))
}

export const printNewLine = () => console.log('')

export const printTags = (tags) => {
  console.log('Using tags:' + EOL, tags)
}
