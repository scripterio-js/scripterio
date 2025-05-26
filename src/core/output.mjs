import { EOL } from 'os'
import { ARGS } from './constants.mjs'
import { applyColor } from '../utils/transform.mjs'

export const printHelp = () => {
  console.log(
    'Available CLI options: ' +
      EOL +
      '' +
      EOL +
      `${ARGS.FILE}        <path>  Path to your test file (e.g., test.js)` +
      EOL +
      `${ARGS.FOLDER}      <path>  Path to your tests directory (e.g., tests)` +
      EOL +
      `${ARGS.TAGS}        <tags>  Tags to filter specific tests (e.g., unit,smoke)` +
      EOL +
      '' +
      EOL +
      `${ARGS.HELP}                 Display help for command` +
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
