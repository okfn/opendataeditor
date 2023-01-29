export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}

export function getFolderPath(path: string) {
  const parts = path.split('/')
  if (parts.length < 2) return undefined
  return parts.slice(0, -1).join('/')
}
