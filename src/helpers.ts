import * as React from 'react'

export function useAsyncReducer(reducer: any, initialState: any) {
  const [state, setState] = React.useState(initialState)
  const dispatchState = async (action: any) => setState(await reducer(state, action))
  return [state, dispatchState]
}

export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}
