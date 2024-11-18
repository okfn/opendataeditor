import { proxy, useSnapshot } from 'valtio'
import { devtools } from 'valtio/utils'

export function createState<T extends object>(name: string, source: T) {
  const state = proxy(source)
  const useState = () => useSnapshot(state) as typeof state
  devtools(state, { name })
  return { state, useState }
}
