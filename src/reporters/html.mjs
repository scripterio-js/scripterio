import { writeFile } from './utils.mjs'
import { template } from './html-template.mjs'

export const htmlReporter = async (results) => {
  const html = template(results)
  await writeFile('index.html', html)
}
