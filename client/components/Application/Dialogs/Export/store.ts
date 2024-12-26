import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'
import FileSaver from 'file-saver'
import { t } from 'i18next'
import invariant from 'tiny-invariant'
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

export function performExport() {
  state.progress = {
    type: 'exporting',
    blocking: true,
    hidden: true,
  }

  try {
    saveFileMetadata()
  } catch {
    state.progress = {
      type: 'error',
      title: t('export-error'),
      message: t('export-error-message'),
    }
  }

  state.progress = undefined
  closeDialog()
}

export function closeDialog() {
  appStore.closeDialog()
}

function saveFileMetadata() {
  const { record } = appStore.getState()
  invariant(record, 'Record is required')

  let metadata: Record<string, any> | undefined
  if (state.format === 'resource') {
    metadata = record.resource
  } else if (state.format === 'schema') {
    metadata = record.resource.schema
  }

  invariant(metadata, 'Metadata is required')

  const descriptor = JSON.stringify(metadata, null, 2)
  const blob = new Blob([descriptor], { type: 'application/json' })
  FileSaver.saveAs(blob, `${record.path}.${state.format}.json`)
}
