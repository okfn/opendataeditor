import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'

class State {
  progress?: types.IProgress
}

export const { state, useState } = helpers.createState('SaveChangesDialog', new State())

export async function saveChanges() {
  const { grid } = appStore.getRefs()
  const { path, resource, table } = appStore.getState()
  if (!path || !grid || !table) return

  appStore.openDialog('saveChanges')
  state.progress = {
    type: 'loading',
    title: 'Saving the updated table',
    message: 'If the file is large, this may take some time...',
    blocking: true,
  }

  const appState = appStore.getState()
  const isTableUpdated = appStore.getIsTableUpdated(appState)
  const isResourceUpdated = appState.isResourceUpdated

  const result = await client.tablePatch({
    path,
    history: isTableUpdated ? table.history : undefined,
    resource: isResourceUpdated ? resource : undefined,
  })

  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      title: 'Error saving changes',
      message: result.detail,
    }
  }

  await appStore.onFileUpdated([path])
  grid.reload()

  state.progress = undefined
  closeDialog()
}

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}
