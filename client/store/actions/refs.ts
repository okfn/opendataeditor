import React from 'react'
import type { ITextEditor } from '@client/components/Editors/Text'
import type { ITableEditor } from '@client/components/Editors/Table'

export function getRefs() {
  return {
    grid: refs.grid.current,
    editor: refs.editor.current,
  }
}

export function setRefs(patch: Partial<typeof refs>) {
  Object.assign(refs, patch)
}

const refs = {
  grid: React.createRef<ITableEditor | undefined>(),
  editor: React.createRef<ITextEditor | undefined>(),
}
