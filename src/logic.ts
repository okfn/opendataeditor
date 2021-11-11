export const initialState = { file: null, resource: null, rows: null, page: 'home' }

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
    body.append('data', JSON.stringify({}))
    body.append('file', new Blob([buffer]), file.name)

    // TODO: move to a proper place
    // Describe
    const response1 = await fetch('http://localhost:8000/api/describe', {
      method: 'POST',
      body: body,
    })
    const data1 = await response1.json()
    const resource = data1.resource

    // TODO: move to a proper place
    // Extract
    const response2 = await fetch('http://localhost:8000/api/extract', {
      method: 'POST',
      body: body,
    })
    const data2 = await response2.json()
    const rows = data2.rows
    console.log(rows)

    return { ...state, file, resource, rows, page: 'describe' }
  }
  return state
}
