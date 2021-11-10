import * as React from 'react'

export function useAsyncReducer(reducer: any, initialState: any) {
  const [state, setState] = React.useState(initialState)
  const dispatchState = async (action: any) => setState(await reducer(state, action))
  return [state, dispatchState]
}
