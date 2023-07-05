export function getFolderPath(path: string) {
  const parts = path.split('/')
  if (parts.length < 2) return undefined
  return parts.slice(0, -1).join('/')
}

export function getFolderList(file: File) {
  const folders = file.webkitRelativePath ? file.webkitRelativePath.split('/') : []
  const folderList = folders
    ? folders.reduce(function (filtered: { [key: string]: any }[], _, index: number) {
        const item = folders.slice(0, index + 1)
        if (item.length > 1) {
          const name = item.slice(-1).join()
          filtered.push({
            name,
            folder: item.slice(0, -1).join('/'),
            type: name === file.name ? 'file' : 'folder',
            file: name === file.name ? file : '',
          })
        }
        return filtered
      }, [])
    : []
  return folderList
}
