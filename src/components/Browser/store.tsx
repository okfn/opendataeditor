import create from 'zustand'
import createContext from 'zustand/context'
import { BrowserProps } from './Browser'
import { Client } from '../../client'

interface BrowserState {
  // Data
  client: Client
  path?: string
}

export function makeStore(props: BrowserProps) {
  return create<BrowserState>((_set, _get) => ({
    // Data
    ...props,
  }))
}

export const { Provider, useStore } = createContext<BrowserState>()
