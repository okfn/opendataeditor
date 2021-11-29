export function encodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '' ? '""' : value))
}

export function decodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '""' ? '' : value))
}
