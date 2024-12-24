import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'

class State {
  progress?: types.IProgress
}

export const { state, useState, resetState } = helpers.createState(
  'ExportDialog',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}
