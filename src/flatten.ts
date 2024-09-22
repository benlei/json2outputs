import { ActionOutput, AnyOutputtable, Anything } from './types'

export const flatten = (object: Anything): ActionOutput[] => {
  if (object === null) {
    return []
  }

  if (Array.isArray(object)) {
    return flattenRecursively(object, '')
  } else if (typeof object === 'object') {
    return flattenRecursively(object, '')
  }

  // primitive... so we can't flatten it
  return []
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

const flattenRecursively = (
  object: AnyOutputtable,
  prefix: string
): ActionOutput[] => {
  const result: ActionOutput[] = []
  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i++) {
      result.push(...flattenObject(`${prefix}[${i}]`, object[i]))
    }
  } else {
    for (const key in object) {
      result.push(...flattenObject(getKeyNotation(prefix, key), object[key]))
    }
  }

  return result
}

const flattenObject = (key: string, value: Anything): ActionOutput[] => {
  if (value === null) {
    return [{ name: key, value: '' }]
  } else if (Array.isArray(value)) {
    return [...flattenRecursively(value, key)]
  } else if (typeof value === 'object') {
    return [...flattenRecursively(value, key)]
  } else {
    return [{ name: key, value: value.toString() }]
  }
}
