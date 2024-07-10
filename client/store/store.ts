import { IState, initialState } from './state'
import { enableMapSet, setAutoFreeze } from 'immer'
// @ts-ignore
import { merge } from 'merge-anything'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

enableMapSet()

// TODO: Remove when a better solution that works for metadata editors are found
setAutoFreeze(false)

const NAME = 'opendataeditor'

export const useStore = create<IState>()(
  persist(
    immer(
      devtools(() => initialState, {
        name: NAME,
        serialize: { options: { map: true, set: true } },
      })
    ),
    {
      name: NAME,
      merge: (persisted, current) => merge(current, persisted) as IState,
      // Any parts of the state can be persisted (currently, none are)
      partialize: () => ({}),
    }
  )
)

export function createSelector<T>(selector: (state: IState) => T) {
  return (state: IState) => selector(state)
}

export const getState = useStore.getState

export function setState(
  title: string,
  patch: Parameters<(typeof useStore)['setState']>[0]
) {
  return useStore.setState(patch, false, title)
}

export function resetState() {
  return useStore.setState(initialState, false)
}
