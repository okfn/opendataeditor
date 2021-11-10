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
    const buffer = await file.arrayBuffer()
    console.log(buffer)
  }
  return { ...state, file }
}
