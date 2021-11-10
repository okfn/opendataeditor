export const initialState = { file: null }

// TODO: remove any
export function reducer(state: any, action: any) {
  switch (action.type) {
    case 'UPLOAD_FILE':
      return { ...state, file: action.files[0] }
    default:
      return state
  }
}
