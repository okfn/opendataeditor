import create from 'zustand'
import createContext from 'zustand/context'
import { BrowserProps } from './Browser'
import { ISession } from '../../interfaces'

interface BrowserState {
  // Data
  session?: ISession
  path?: string
}

export function makeStore(props: BrowserProps) {
  return create<BrowserState>((_set, _get) => ({
    // Data
    session: props.session,
    path: props.path,
  }))
}

export const { Provider, useStore } = createContext<BrowserState>()
