import { ActionOutput, Anything, FlattenStack } from './types'

const isNotFlattenable = (object: Anything): boolean =>
  object === null || (!Array.isArray(object) && typeof object !== 'object')

export const flatten = (object: Anything): ActionOutput[] => {
  if (isNotFlattenable(object)) {
    return []
  }

  const stack: FlattenStack[] = [{ value: object, prefix: '' }]
  const result: ActionOutput[] = []

  while (stack.length) {
    const { prefix, value } = stack[stack.length - 1]
    stack.pop() // IDE says it can potentially return undefined... so avoiding use of pop() here

    if (value === null) {
      // handle null values
      result.push({ name: prefix, value: '' })
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        stack.push({ prefix: `${prefix}[${i}]`, value: value[i] })
      }
    } else if (typeof value === 'object') {
      for (const key in value) {
        stack.push({ prefix: getKeyNotation(prefix, key), value: value[key] })
      }
    } else {
      // Handle primitive values
      result.push({ name: prefix, value: value.toString() })
    }
  }

  return result
}

export const isDotNotationUsable = (key: string): boolean =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)

export const getKeyNotation = (prefix: string, key: string): string => {
  if (prefix.length === 0) {
    return isDotNotationUsable(key) ? key : `[${JSON.stringify(key)}]`
  }

  return isDotNotationUsable(key)
    ? `${prefix}.${key}`
    : `${prefix}[${JSON.stringify(key)}]`
}
