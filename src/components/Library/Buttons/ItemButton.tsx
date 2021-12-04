import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

interface ItemButtonProps {
  index: number
  name: string
  type: string
  isGrid?: boolean
  onClick: () => void
}

export default function ItemButton(props: ItemButtonProps) {
  const theme = useTheme()
  return (
    <Button
      size="large"
      color="info"
      variant="outlined"
      endIcon={props.isGrid ? null : props.type.toUpperCase()}
      onClick={() => props.onClick()}
      title="View field"
      key={props.index}
      sx={{
        height: theme.spacing(7),
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
