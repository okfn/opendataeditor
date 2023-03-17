import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

interface EditorListItemProps {
  index?: number
  kind: string
  name: string
  type?: string
  title?: string
  isGrid?: boolean
  disabled?: boolean
  onClick?: () => void
}

export default function EditorListItem(props: EditorListItemProps) {
  const theme = useTheme()
  return (
    <Button
      size="large"
      color="info"
      variant="outlined"
      endIcon={props.type && !props.isGrid ? props.type.toUpperCase() : undefined}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      disabled={props.disabled}
      key={props.index}
      title={props.title}
      sx={{
        height: theme.spacing(5),
        width: props.isGrid ? 'inherit' : '100%',
        marginRight: props.isGrid ? 2 : 0,
        justifyContent: 'space-between',
        textTransform: 'initial',
        padding: [2, 2],
        marginTop: 2,
        marginBottom: 1,
      }}
    >
      {props.name}
    </Button>
  )
}
