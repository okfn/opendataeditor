import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'
import { IFormat } from './types'

class State {
  format: IFormat = 'resource'
  progress?: types.IProgress
}

export const { state, useState, resetState } = helpers.createState(
  'ExportDialog',
  new State()
)

export function setFormat(format: IFormat) {
  state.format = format
}

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}
