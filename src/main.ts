import * as core from '@actions/core'
import { flatten } from './flatten'
import { getJSONFromInputs } from './inputs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    for (const outputs of flatten(getJSONFromInputs())) {
      core.setOutput(outputs.name, outputs.value)
    }
  } catch (error) {
    // show a warning if something went wrong
    if (error instanceof Error) core.warning(error.message)
  }
}
