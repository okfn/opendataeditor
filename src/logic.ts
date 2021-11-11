export const initialState = { file: null, resource: null, page: 'home' }

// TODO: remove any
export async function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_PAGE':
      return setPage(state, action)
    case 'UPDATE_RESOURCE':
      return updateResource(state, action)
    case 'UPLOAD_FILE':
      return uploadFile(state, action)
    default:
      return state
  }
}

function setPage(state: any, action: any) {
  return { ...state, page: action.page }
}

function updateResource(state: any, action: any) {
  if (!state.resource) return state
  let { resource } = state
  resource = { ...resource, ...action.update }
  return { ...state, resource }
}

async function uploadFile(state: any, action: any) {
  const { files } = action
  if (files.length) {
    const file = files[0]
    // TODO: add size limit
    const buffer = await file.arrayBuffer()
    const body = new FormData()
    body.append('data', JSON.stringify({ a: 1, b: 2 }))
    body.append('file', new Blob([buffer]), file.name)
    const response = await fetch('http://localhost:8000', {
      method: 'POST',
      body: body,
    })
    const data = await response.json()
    const resource = data.resource
    return { ...state, file, resource, page: 'describe' }
  }
  return state
}
