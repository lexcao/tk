export function toArray(value: undefined | string | string[]): string[] {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value :
    value.split(" ").filter(Boolean)
}
