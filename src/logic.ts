export const initialState = { file: null }

// TODO: remove any
export async function reducer(state: any, action: any) {
  switch (action.type) {
    case 'UPLOAD_FILE':
      return uploadFile(state, action)
    case 'UPDATE_RESOURCE':
      return updateResource(state, action)
    default:
      return state
  }
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
    console.log(resource)
    return { ...state, file, resource }
  }
  return state
}
