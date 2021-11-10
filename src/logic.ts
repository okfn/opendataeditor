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
  return { ...state, file: action.files[0] }
}
