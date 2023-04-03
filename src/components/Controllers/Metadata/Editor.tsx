import * as React from 'react'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import { IResource, IDialect, ISchema } from '../../../interfaces'
import { useStore } from './store'

export default function Content() {
  const file = useStore((state) => state.file)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <React.Fragment>
      {file.type === 'resource' && (
        <Resource
          resource={modified as IResource}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
      {file.type === 'dialect' && (
        <Dialect
          dialect={modified as IDialect}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
      {file.type === 'schema' && (
        <Schema
          schema={modified as ISchema}
          onChange={(descriptor) => updateState({ modified: descriptor })}
        />
      )}
    </React.Fragment>
  )
}
