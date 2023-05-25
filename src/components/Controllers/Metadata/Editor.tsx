import * as React from 'react'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import { useStore } from './store'
import * as types from '../../../types'

export default function Content() {
  const record = useStore((state) => state.record)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!record) return null
  if (!modified) return null
  return (
    <React.Fragment>
      {record.type === 'resource' && (
        <Resource
          resource={modified as types.IResource}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
      {record.type === 'dialect' && (
        <Dialect
          dialect={modified as types.IDialect}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
      {record.type === 'schema' && (
        <Schema
          schema={modified as types.ISchema}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
    </React.Fragment>
  )
}
