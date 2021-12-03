import * as React from 'react'
import Button from '@mui/material/Button'

interface ItemButtonProps {
  index: number
  name: string
  type: string
  isGrid?: boolean
  handleClick: () => void
}

export default function ItemButton(props: ItemButtonProps) {
  return (
    <Button
      size="large"
      color="info"
      variant="outlined"
      endIcon={props.isGrid ? null : props.type.toUpperCase()}
      onClick={() => props.handleClick()}
      title="View field"
      key={props.index}
      sx={{
        height: '56px',
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
