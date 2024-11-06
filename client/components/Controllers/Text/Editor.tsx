import * as React from 'react'
import Missing from '../../Views/Missing'
import * as store from '@client/store'

export default function Editor() {
  const contents = store.useStore((state) => state.text?.contents)
  const format = store.useStore((state) => state.record?.resource.format)
  const maximalVersion = store.useStore((state) => state.text?.maximalVersion)
  if (contents === undefined || !maximalVersion) return null

  return (
    <React.Fragment>
      <Missing format={format} />
    </React.Fragment>
  )
}
