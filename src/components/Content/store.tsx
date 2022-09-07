import create from 'zustand'
import createContext from 'zustand/context'
import { ContentProps } from './Content'

interface ContentState {
  path: string
}

export function makeStore(props: ContentProps) {
  return create<ContentState>((set, get) => ({
    path: props.path,
  }))
}

export const { Provider, useStore } = createContext<ContentState>()
