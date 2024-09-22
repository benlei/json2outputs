import * as core from '@actions/core'
import { Anything } from './types'
import { readFileSync } from './file'

export const jsonInput = (): string =>
  core.getInput('json', {
    required: false,
    trimWhitespace: true
  })

export const fileInput = (): string =>
  core.getInput('file', {
    required: false,
    trimWhitespace: true
  })

export const getJSONFromInputs = (): Anything => {
  const json = jsonInput()
  const file = fileInput()
  try {
    if (json) {
      return JSON.parse(json)
    } else if (file) {
      return JSON.parse(readFileSync(file))
    } else {
      return {}
    }
  } catch (error) {
    core.warning(`Couldn't parse JSON: ${error}`)
    return {}
  }
}
