import type { ITableEditor } from '@client/components/Editors/Table'
import type { ITextEditor } from '@client/components/Editors/Text'
import * as settings from '@client/settings'
import { redoTableChange, undoTableChange } from '@client/store'
import type * as types from '@client/types'
import delay from 'delay'
import React from 'react'
import { IDialog, IPanel } from '../state'
import * as store from '../store'
import { getIsFileOrResourceUpdated, loadFiles } from './file'

export async function onAppStart() {
  // @ts-ignore
  const bridge = window?.opendataeditor
  const sendFatalError = bridge?.sendFatalError

  let ready = false
  let attempt = 0
  const maxAttempts = sendFatalError ? 300 : 3
  const delaySeconds = 1

  // Note: it is not possible to use imperative code mutating state
  // inside React rendering functions (moved here from the Layout component)
  openDialog('welcomeBanner')

  while (!ready) {
    try {
      await loadFiles(true)
      ready = true
    } catch (error) {
      attempt += 1
      if (attempt >= maxAttempts) {
        const serverUrl = settings.SERVER_URL
        const message = `Client cannot connect to server on "${serverUrl}"`
        sendFatalError ? sendFatalError(message) : alert(message)
      }
      await delay(delaySeconds * 1000)
    }
  }

  // Register on windows close event handler (only Desktop env)
  // to prevent closing the app when there are unsaved changes

  if (bridge?.closeDesktopApp) {
    window.onbeforeunload = (event) => {
      const isUpdated = getIsFileOrResourceUpdated(store.getState())
      if (isUpdated) {
        event.preventDefault()
        openDialog('closeWithUnsavedChanges')
      }
    }
  }

  // Register menu events

  bridge?.onMenuAddNewFile(() => {
    openDialog('fileUpload', 0)
  })

  bridge?.onMenuAddExternalFile(() => {
    openDialog('fileUpload', 1)
  })

  bridge?.onDeleteFile(() => {
    openDialog('deleteFilesFolders')
  })

  bridge?.onPublishFile(() => {
    openDialog('publish')
  })

  bridge?.onToggleMetadata(() => {
    togglePanel('metadata')
  })

  bridge?.onToggleErrorsReport(() => {
    togglePanel('report')
  })

  bridge?.onToggleSource(() => {
    togglePanel('source')
  })

  bridge?.onUndo(() => {
    undoTableChange()
  })

  bridge?.onRedo(() => {
    redoTableChange()
  })
}

export function closeDesktopApp() {
  // @ts-ignore
  const bridge = window?.opendataeditor

  bridge?.closeDesktopApp()
}

export function setHideWelcomeScreen(hideWelcomeScreen: boolean) {
  store.setState('hide-welcome-screen', (state) => {
    state.hideWelcomeScreen = hideWelcomeScreen
  })
}

export function setHideOpenLocationDialog(hideOpenLocationDialog: boolean) {
  store.setState('hide-open-location-dialog', (state) => {
    state.hideOpenLocationDialog = hideOpenLocationDialog
  })
}

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

export function closeError() {
  store.setState('remove-error', (state) => {
    state.error = undefined
  })
}

export async function emitEvent(event: types.IEvent) {
  store.setState(`${event.type}-file-event-start`, (state) => {
    state.event = event
  })

  await delay(500)

  store.setState(`${event.type}-file-event-end`, (state) => {
    state.event = undefined
  })
}

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

export function getRefs() {
  return {
    grid: refs.grid?.current,
    editor: refs.editor?.current,
  }
}

export function setRefs(patch: Partial<typeof refs>) {
  Object.assign(refs, patch)
}

const refs = {
  grid: React.createRef<ITableEditor | undefined>(),
  editor: React.createRef<ITextEditor | undefined>(),
}
