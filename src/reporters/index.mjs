import { REPORTERS } from '../core/constants.mjs'
import { htmlReporter } from './html.mjs'
import { result } from '../core/context.mjs'
import { RunnerError } from '../errors/runner.mjs'

export const getReporter = async (type) => {
  switch (type) {
    case REPORTERS.HTML:
      await htmlReporter(result)
      break
    case REPORTERS.CONSOLE:
      break
    default:
      throw new RunnerError(`Incorrect "${type}" reporter type!`)
  }
}
