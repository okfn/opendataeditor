import { IDialog } from '../state'
import * as store from '../store'

export function openDialog(dialog: IDialog) {
  store.setState('open-dialog', (state) => {
    state.dialog = dialog
  })
}

export function closeDialog() {
  store.setState('close-dialog', (state) => {
    state.dialog = undefined
  })
}
