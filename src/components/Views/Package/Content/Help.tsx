import * as React from 'react'
import HelpCard from '../../Library/HelpCard'
import json from '../Utils/help.yaml'

export interface HelperProps {
  elementGroup: string
  elementName?: string | undefined
}

export default function Help(props: HelperProps) {
  function setText(label: string) {
    const key = props.elementName
      ? `${props.elementGroup}.${props.elementName}.${label}`
      : `${props.elementGroup}.${label}`
    return json[key]
  }
  return (
    <HelpCard
      title={setText('title')}
      subtitle={setText('subtitle')}
      link={setText('link')}
    >
      {setText('description')}
    </HelpCard>
  )
}
