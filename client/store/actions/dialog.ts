import { IDialog } from '../state'
import * as store from '../store'

export function toggleDialog(dialog: IDialog) {
  const current = store.getState().dialog
  if (current !== dialog) {
    openDialog(dialog)
  } else {
    closeDialog()
  }
}

export function openDialog(dialog: IDialog, dialogTab?: number) {
  store.setState('open-dialog', (state) => {
    state.dialog = dialog
    state.dialogTab = dialogTab
  })
}

export function closeDialog() {
  store.setState('close-dialog', (state) => {
    state.dialog = state.nextDialog
    state.nextDialog = undefined
  })
}
