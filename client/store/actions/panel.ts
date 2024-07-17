import { IPanel } from '../state'
import * as store from '../store'

export function togglePanel(panel: IPanel) {
  const current = store.getState().panel
  if (current !== panel) {
    openPanel(panel)
  } else {
    closePanel()
  }
}

export function openPanel(panel: IPanel) {
  store.setState('open-panel', (state) => {
    state.panel = panel
  })
}

export function closePanel() {
  store.setState('close-panel', (state) => {
    state.panel = undefined
  })
}
