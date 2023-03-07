import * as React from 'react'

interface ActionButtonContentProps {
  label: string
  icon: React.ElementType
}

export default function ActionButtonContent(props: ActionButtonContentProps) {
  const { icon: Icon, label } = props
  return (
    <React.Fragment>
      <Icon fontSize="small" sx={{ mr: 1 }} /> {label}
    </React.Fragment>
  )
}
