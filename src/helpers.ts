export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}
export function isDirectory(path: string) {
  const re = /^.*\.[^\\]+$/
  return !re.test(path)
}
export function getFolderPath(path: string) {
  const folder = path.substring(0, path.lastIndexOf('/'))
  return isDirectory(folder) ? folder : ''
}
export function hasResource(paths: string[] | undefined) {
  if (!paths) return false

  for (const path of paths) {
    if (!isDirectory(path)) return true
  }
  return false
}
