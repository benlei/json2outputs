export type AnyPrimitive = string | number | boolean | null

export interface AnyObject {
  [key: string]: AnyPrimitive | AnyObject | AnyPrimitive[] | AnyObject[]
}

export type Anything = AnyPrimitive | AnyObject | AnyPrimitive[] | AnyObject[]
export type AnyOutputtable = AnyPrimitive[] | AnyObject[] | AnyObject

export interface ActionOutput {
  name: string
  value: string
}
