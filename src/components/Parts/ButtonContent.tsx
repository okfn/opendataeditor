import * as React from 'react'

interface ButtonContentProps {
  label: string
  icon: React.ElementType
}

export default function ButtonContent(props: ButtonContentProps) {
  const { icon: Icon, label } = props
  return (
    <React.Fragment>
      <Icon fontSize="small" sx={{ mr: 1 }} /> {label}
    </React.Fragment>
  )
}
