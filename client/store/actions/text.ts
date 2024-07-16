import { client } from '@client/client'
import { getRefs } from './refs'
import { openDialog } from './dialog'
import { getLanguageByFormat } from '@client/helpers'
import { onFileCreated, onFileUpdated } from './file'
import { revertResource, getIsResourceUpdated } from './resource'
import dirtyJson from 'dirty-json'
import * as store from '../store'
import invariant from 'tiny-invariant'

export async function openText() {
  const { source } = store.getState()

  invariant(source?.text)

  store.setState('close-text', (state) => {
    state.text = {
      contents: source.text!,
      minimalVersion: 1,
      currentVersion: 1,
      maximalVersion: 1,
    }
  })
}

export async function closeText() {
  store.setState('close-text', (state) => {
    state.text = undefined
  })
}

export async function updateText(value?: string) {
  const { editor } = getRefs()
  const version = editor?.getModel()?.getAlternativeVersionId() || 1

  store.setState('update-text', (state) => {
    invariant(state.text)

    state.text.contents = value || ''
    state.text.currentVersion = version
    state.text.maximalVersion = Math.max(version, state.text.maximalVersion)
  })
}

export async function editText(prompt: string) {
  const { editor } = getRefs()
  const { path, text } = store.getState()

  invariant(path)
  invariant(text)
  invariant(editor)

  const result = await client.textEdit({ path, text: text.contents, prompt })

  if (result instanceof client.Error) {
    return store.setState('edit-text', (state) => {
      state.error = result
    })
  }

  editor.setValue(result.text)
}

export async function forkText(toPath: string) {
  const { path, text, resource } = store.getState()

  invariant(path)
  invariant(text)

  const result = await client.textPatch({ path, toPath, text: text.contents, resource })

  if (result instanceof client.Error) {
    return store.setState('fork-text', (state) => {
      state.error = result
    })
  }

  await onFileCreated([toPath])
}

export async function revertText() {
  const { editor } = getRefs()
  const { record, source } = store.getState()

  invariant(editor)
  invariant(record)
  invariant(source?.text)

  editor.setValue(source.text)
  revertResource()
}

export async function saveText() {
  const { path, text, resource } = store.getState()

  invariant(path)
  invariant(text)

  const isTextUpdated = getIsTextUpdated(store.getState())
  const isResourceUpdated = getIsResourceUpdated(store.getState())

  const result = await client.textPatch({
    path,
    text: isTextUpdated ? text.contents : undefined,
    resource: isResourceUpdated ? resource : undefined,
  })

  if (result instanceof client.Error) {
    return store.setState('save-text', (state) => {
      state.error = result
    })
  }

  await onFileUpdated([result.path])
}

export function clearText() {
  store.setState('clear-text', (state) => {
    state.text!.contents = ''
  })
}

export function undoText() {
  const { editor } = getRefs()
  invariant(editor)

  editor.trigger(null, 'undo', null)
}

export function redoText() {
  const { editor } = getRefs()
  invariant(editor)

  editor.trigger(null, 'redo', null)
}

export function fixJson() {
  const { editor } = getRefs()
  invariant(editor)

  const value = editor.getValue()
  const fixedValue = value && dirtyJson.parse(value)
  const formattedValue = fixedValue && prettifyJsonString(JSON.stringify(fixedValue))

  editor.setValue(formattedValue)
}

export function minifyJson() {
  const { editor } = getRefs()
  invariant(editor)

  const value = editor.getValue()
  if (!value) return

  const minifiedValue = minifyJsonString(value)
  editor.setValue(minifiedValue)
}

export function prettifyJson() {
  const { editor } = getRefs()
  invariant(editor)

  const action = editor.getAction('editor.action.formatDocument')
  if (!action) return

  action.run()
}

export function onTextClickAway() {
  const { dialog } = store.getState()
  const isUpdated = getIsTextOrResourceUpdated(store.getState())

  if (isUpdated && !dialog) {
    openDialog('leave')
  }
}

// Selectors

export const getIsTextOrResourceUpdated = store.createSelector((state) => {
  return getIsTextUpdated(state) || getIsResourceUpdated(state)
})

export const getIsTextUpdated = store.createSelector((state) => {
  return state.source?.text !== state.text?.contents
})

export const getTextLanguage = store.createSelector((state) => {
  const resource = state.record?.resource
  if (!resource) return undefined
  return getLanguageByFormat(resource.format) || 'plaintext'
})

// Helpers

export function prettifyJsonString(jsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, '\t')
  } catch (err) {
    return jsonString
  }
}

export function minifyJsonString(jsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonString), null)
  } catch (err) {
    return jsonString
  }
}
