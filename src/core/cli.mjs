import { ARGS } from './constants.mjs'
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

export const getFileNameFromArgs = () => {
  const customArgPrefix = ARGS.FILE
  return getCustomArgFromArgs(customArgPrefix) || ''
}

export const getFolderNameFromArgs = () => {
  const customArgPrefix = ARGS.FOLDER
  return getCustomArgFromArgs(customArgPrefix) || ''
}

export const getTagsFromArgs = () => {
  const customArgPrefix = ARGS.TAGS
  return getCustomArgFromArgs(customArgPrefix) || ''
}
