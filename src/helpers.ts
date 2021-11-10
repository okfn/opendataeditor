import * as React from 'react'

export function useAsyncReducer(reducer: any, initialState: any) {
  const [state, setState] = React.useState(initialState)
  const dispatchState = async (action: any) => setState(await reducer(state, action))
  return [state, dispatchState]
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    // TODO: review the slice
    reader.readAsText(file.slice(0, 65536))
    reader.onload = () => {
      const result = reader.result
      if (!result) return reject(new Error('Cannot read file'))
      if (result instanceof ArrayBuffer) return reject(new Error('Cannot read file'))
      resolve(result)
    }
    reader.onerror = () => reject(reader.error)
  })
}
