import { ARGS, REPORTERS } from './constants.mjs'
import { printHelp, printError } from './output.mjs'

const args = process.argv

export const checkCliArgs = () => {
  if (args.length > 2) {
    const userArgs = args.slice(2)
    userArgs.forEach((arg) => {
      if (!Object.values(ARGS).includes(arg.replace(/=.*$/, '='))) {
        printError(arg)
      } else {
        switch (arg) {
          case ARGS.HELP:
            printHelp()
            break
        }
      }
    })
  }
}

const getCustomArgFromArgs = (customArgPrefix) => {
  const customArg = args.find((arg) => arg.includes(customArgPrefix)) ?? ''
  const parsedCustomArg = customArg.split(customArgPrefix)
  const customArgValue = parsedCustomArg[1]
  return customArgValue
}

const getArgValue = (argKey, defaultValue = '') =>
  getCustomArgFromArgs(argKey) || defaultValue

export const getFileNameFromArgs = () => getArgValue(ARGS.FILE)
export const getFolderNameFromArgs = () => getArgValue(ARGS.FOLDER)
export const getTagsFromArgs = () => getArgValue(ARGS.TAGS)
export const getReporterTypeFromArgs = () =>
  getArgValue(ARGS.REPORTER, REPORTERS.CONSOLE)
export const getRetryFromArgs = () => getArgValue(ARGS.RETRY)
export const getTimeoutFromArgs = () => getArgValue(ARGS.TIMEOUT)
