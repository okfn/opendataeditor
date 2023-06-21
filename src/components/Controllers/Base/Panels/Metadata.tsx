import * as React from 'react'
import Resource from '../../../Editors/Resource'
import * as types from '../../../../types'

export interface MetadataPanelProps {
  resource?: types.IResource
  onChange: (resource: types.IResource) => void
  onFieldSelected?: (name?: string) => void
}

export default function MetadataPanel(props: MetadataPanelProps) {
  if (!props.resource) return null
  return (
    <Resource
      shallow={props.resource.type !== 'table'}
      resource={props.resource}
      onChange={props.onChange}
      onFieldSelected={props.onFieldSelected}
    />
  )
}
