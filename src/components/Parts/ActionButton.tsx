import * as React from 'react'

interface ActionButtonProps {
  label: string
  icon: React.ElementType
}

export default function ActionButton(props: ActionButtonProps) {
  const { icon: Icon, label } = props
  return (
    <React.Fragment>
      <Icon fontSize="small" sx={{ mr: 1 }} /> {label}
    </React.Fragment>
  )
}
