import { IDialog } from './types'
import * as store from '../store'

export function openDialog(dialog: IDialog) {
  store.setState('open-dialog', (state) => {
    state.main.dialog = dialog
  })
}
