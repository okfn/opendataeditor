export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}
export function isDirectory(path: string) {
  const re = /^.*\.[^\\]+$/
  return !re.test(path)
}
