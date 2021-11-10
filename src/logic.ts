export const initialState = { file: null }

// TODO: remove any
export async function reducer(state: any, action: any) {
  switch (action.type) {
    case 'UPLOAD_FILE':
      return uploadFile(state, action)
    default:
      return state
  }
}

async function uploadFile(state: any, action: any) {
  const { files } = action
  let file = null
  if (files.length) {
    file = files[0]
    // TODO: add size limit
    const buffer = await file.arrayBuffer()
    const body = new FormData()
    body.append('data', JSON.stringify({ a: 1, b: 2 }))
    body.append('file', new Blob([buffer]), file.name)
    await fetch('http://localhost:8000', {
      method: 'POST',
      body: body,
    })
  }
  return { ...state, file }
}
