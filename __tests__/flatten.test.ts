import { isDotNotationUsable, getKeyNotation, flatten } from '../src/flatten'

describe('isDotNotationUsable', () => {
  it('should return true for a valid key', () => {
    expect(isDotNotationUsable('key')).toBe(true)
    expect(isDotNotationUsable('_')).toBe(true)
    expect(isDotNotationUsable('hello_world')).toBe(true)
    expect(isDotNotationUsable('thisIsCamelCase')).toBe(true)
  })

  it('should return false for an invalid key', () => {
    expect(isDotNotationUsable('1key')).toBe(false)
    expect(isDotNotationUsable('key-')).toBe(false)
    expect(isDotNotationUsable('key-value')).toBe(false)
    expect(isDotNotationUsable('example.com')).toBe(false)
    expect(isDotNotationUsable('example.com/text')).toBe(false)
  })
})

describe('getKeyNotation', () => {
  it('should return the key as-is if its usable for dot notation', () => {
    expect(getKeyNotation('', 'key')).toBe('key')
    expect(getKeyNotation('', '_')).toBe('_')
    expect(getKeyNotation('', 'hello_world')).toBe('hello_world')
    expect(getKeyNotation('', 'thisIsCamelCase')).toBe('thisIsCamelCase')
  })

  it('should return the key wrapped in brackets if its not usable for dot notation', () => {
    expect(getKeyNotation('', '1key')).toBe('["1key"]')
    expect(getKeyNotation('', 'key-')).toBe('["key-"]')
    expect(getKeyNotation('', 'key-value')).toBe('["key-value"]')
    expect(getKeyNotation('', 'example.com')).toBe('["example.com"]')
    expect(getKeyNotation('', 'example.com/text')).toBe('["example.com/text"]')
  })

  it('should return the key with the prefix if it exists', () => {
    expect(getKeyNotation('prefix', 'key')).toBe('prefix.key')
    expect(getKeyNotation('prefix', '_')).toBe('prefix._')
    expect(getKeyNotation('prefix', 'hello_world')).toBe('prefix.hello_world')
    expect(getKeyNotation('prefix', 'thisIsCamelCase')).toBe(
      'prefix.thisIsCamelCase'
    )

    expect(getKeyNotation('prefix', '1key')).toBe('prefix["1key"]')
    expect(getKeyNotation('prefix', 'key-')).toBe('prefix["key-"]')
    expect(getKeyNotation('prefix.bar', 'key-value')).toBe(
      'prefix.bar["key-value"]'
    )
    expect(getKeyNotation('prefix["content"]', 'example.com')).toBe(
      'prefix["content"]["example.com"]'
    )
  })
})

describe('flatten', () => {
  it('should return an empty array for null', () => {
    expect(flatten(null)).toEqual([])
  })

  it('should return an empty array for a primitive', () => {
    expect(flatten('hello')).toEqual([])
    expect(flatten(123)).toEqual([])
    expect(flatten(true)).toEqual([])
  })

  it('should handle flattening a basic array', () => {
    expect(flatten([1, 2, 3])).toEqual(
      expect.arrayContaining([
        { name: '[0]', value: '1' },
        { name: '[1]', value: '2' },
        { name: '[2]', value: '3' }
      ])
    )
  })

  it('should handle flattening a basic object', () => {
    expect(
      flatten({ key: 'value', 'foo.com': 'lalala', 'foo-bar': true })
    ).toEqual(
      expect.arrayContaining([
        {
          name: 'key',
          value: 'value'
        },
        {
          name: '["foo.com"]',
          value: 'lalala'
        },
        {
          name: '["foo-bar"]',
          value: 'true'
        }
      ])
    )
  })

  it('should handle nested objects', () => {
    const result = flatten({
      key: 'value',
      nested: {
        key: 'nested key',
        annotations: {
          'another.key/123': 'another key',
          'another.key/something': null
        },
        someArray: [{ two: 'three' }],
        emptyArray: [],
        emptyObject: {}
      }
    })
    expect(result.length).toBe(5)
    expect(result).toEqual(
      expect.arrayContaining([
        {
          name: 'key',
          value: 'value'
        },
        {
          name: 'nested.key',
          value: 'nested key'
        },
        {
          name: 'nested.annotations["another.key/123"]',
          value: 'another key'
        },
        {
          name: 'nested.annotations["another.key/something"]',
          value: ''
        },
        {
          name: 'nested.someArray[0].two',
          value: 'three'
        }
      ])
    )
  })
})
