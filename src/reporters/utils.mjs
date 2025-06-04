import fs from 'fs/promises'
import path from 'path'

const folderName = 'scripterio-report'

export const createResultsDir = async () => {
  try {
    await fs.access(folderName)
  } catch {
    await fs.mkdir(folderName)
  }
}

export const writeFile = async (filename, content) => {
  await createResultsDir()
  await fs.writeFile(path.join(folderName, filename), content)
}
