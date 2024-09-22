import * as inputs from '../src/inputs'
import * as file from '../src/file'
import { getJSONFromInputs } from '../src/inputs'

describe('getJSONFromInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    jest.spyOn(inputs, 'jsonInput').mockReturnValue('')
    jest.spyOn(inputs, 'fileInput').mockReturnValue('')
  })

  it('should not throw an error if an error occurs', () => {
    jest.spyOn(inputs, 'jsonInput').mockReturnValue('zzzzz')
    expect(getJSONFromInputs()).toStrictEqual({})

    jest.spyOn(inputs, 'jsonInput').mockReturnValue('')
    expect(getJSONFromInputs()).toStrictEqual({})
  })

  it('should return an object if the body input is valid', () => {
    jest.spyOn(inputs, 'jsonInput').mockReturnValue('{"a":1}')
    expect(getJSONFromInputs()).toStrictEqual({ a: 1 })
  })

  it('return an array if the body input is valid', () => {
    jest.spyOn(inputs, 'jsonInput').mockReturnValue('[1,2,3]')
    expect(getJSONFromInputs()).toStrictEqual([1, 2, 3])
  })

  it('should return an object if the file input is valid', () => {
    jest.spyOn(inputs, 'fileInput').mockReturnValue('file.json')
    jest.spyOn(file, 'readFileSync').mockReturnValue('{"a":1}')
    expect(getJSONFromInputs()).toStrictEqual({ a: 1 })
  })

  it('should return an array if the file input is valid', () => {
    jest.spyOn(inputs, 'fileInput').mockReturnValue('file.json')
    jest.spyOn(file, 'readFileSync').mockReturnValue('[1,2,3]')
    expect(getJSONFromInputs()).toStrictEqual([1, 2, 3])
  })

  it('should return an empty object if the file input is invalid', () => {
    jest.spyOn(inputs, 'fileInput').mockReturnValue('file.json')
    jest.spyOn(file, 'readFileSync').mockReturnValue('zzzzz')
    expect(getJSONFromInputs()).toStrictEqual({})

    jest.spyOn(file, 'readFileSync').mockImplementation(() => {
      throw new Error()
    })
    expect(getJSONFromInputs()).toStrictEqual({})
  })

  it('should return a primitive if input results is a primitive', () => {
    jest.spyOn(inputs, 'jsonInput').mockReturnValue('"a"')
    expect(getJSONFromInputs()).toStrictEqual('a')
  })
})
