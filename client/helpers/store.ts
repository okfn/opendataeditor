import { cloneDeep } from 'lodash'
import { proxy, useSnapshot } from 'valtio'
import { devtools } from 'valtio/utils'

export function createState<T extends object>(name: string, source: T) {
  const state = proxy(cloneDeep(source))

  const useState = () => {
    return useSnapshot(state) as typeof state
  }

  const resetState = () => {
    for (const key of Object.keys(state)) {
      // @ts-ignore
      state[key] = cloneDeep(source[key])
    }
  }

  devtools(state, { name })
  return { state, useState, resetState }
}
