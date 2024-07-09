import React from 'react'
import type { ITableEditor } from '@client/components/Editors/Table'

export function getRefs() {
  return { grid: refs.grid.current }
}

export function setRefs(patch: typeof refs) {
  Object.assign(refs, patch)
}

const refs = {
  grid: React.createRef<ITableEditor | undefined>(),
}
