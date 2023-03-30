export function prettifyJsonString(jsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, '\t')
  } catch (err) {
    return jsonString
  }
}

export function minifyJsonString(jsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonString), null)
  } catch (err) {
    return jsonString
  }
}
