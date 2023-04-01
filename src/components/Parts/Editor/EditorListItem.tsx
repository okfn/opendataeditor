import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

interface EditorListItemProps {
  index?: number
  kind: string
  name: string
  type?: string
  title?: string
  isGrid?: boolean
  disabled?: boolean
  onClick?: () => void
  onRemoveClick?: () => void
}

export default function EditorListItem(props: EditorListItemProps) {
  const theme = useTheme()
  const EndIcon = () => {
    const label = (props.type || 'item').toUpperCase()
    return (
      <Box>
        <Typography component="span">{label}</Typography>
        <Button
          size="small"
          color="warning"
          component="span"
          title={`Remove ${capitalize(props.kind)}`}
          sx={{ marginLeft: 2, textDecoration: 'underline' }}
          onClick={(ev) => {
            ev.stopPropagation()
            props.onRemoveClick && props.onRemoveClick()
          }}
        >
          Remove
        </Button>
      </Box>
    )
  }
  return (
    <Button
      size="large"
      variant="outlined"
      endIcon={!props.isGrid && props.type ? <EndIcon /> : null}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      disabled={props.disabled}
      key={props.index}
      title={props.title || `Edit ${capitalize(props.kind)}`}
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
