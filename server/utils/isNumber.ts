// server/utils/isNumber.ts

export function isNumeric (str: string): boolean {
  return /^\d+$/.test(str)
}
