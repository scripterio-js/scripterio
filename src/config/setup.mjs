import path from 'path'
import fs from 'fs'
import { getConfig } from '../config/config.mjs'

const config = getConfig()

const getSingleFilePath = async (dir) => {
  try {
    const fullPath = dir
    await fs.promises.access(fullPath)
    return [fullPath]
  } catch {
    console.error(`File ${config.file} could not be accessed.`)
    process.exit(0)
  }
}

const getMultipleFilePath = (dir) => {
  const fileNames = fs.readdirSync(dir)
  let filePaths = []
  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      filePaths = filePaths.concat(getMultipleFilePath(filePath))
    } else if (fileName.endsWith('.js')) {
      filePaths.push(filePath)
    }
  })
  return filePaths
}

const hasSingleFile = () => config.file

const getTestFile = async () => {
  return getSingleFilePath(path.resolve(process.cwd(), config.file))
}

const getTestFiles = async () => {
  return getMultipleFilePath(path.resolve(process.cwd(), config.folder))
}

export const getTags = () => {
  return config.tags ? config.tags.split(',') : ''
}

export const getReporterType = () => {
  return config.reporter || ''
}

export const chooseTestFiles = () =>
  hasSingleFile() ? getTestFile() : getTestFiles()
