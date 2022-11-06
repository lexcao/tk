export function toArray<T>(value: undefined | T | T[]): T[] {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}
