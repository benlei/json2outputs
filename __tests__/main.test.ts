/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as inputs from '../src/inputs'

// Mock the GitHub Actions core library
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()

    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('should set the output', async () => {
    jest
      .spyOn(inputs, 'getJSONFromInputs')
      .mockReturnValue({ a: 1, foo: [1, 2, 3], bar: { key: 'value' } })

    await main.run()

    expect(setOutputMock).toHaveBeenCalledWith('a', '1')
    expect(setOutputMock).toHaveBeenCalledWith('foo[0]', '1')
    expect(setOutputMock).toHaveBeenCalledWith('foo[1]', '2')
    expect(setOutputMock).toHaveBeenCalledWith('foo[2]', '3')
    expect(setOutputMock).toHaveBeenCalledWith('bar.key', 'value')
  })
})
