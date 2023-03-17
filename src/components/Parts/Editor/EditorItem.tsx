import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../Columns'
import HeadingBox from './Internals/HeadingBox'

export interface EditorItemProps {
  kind: string
  name: string
  onRemoveClick: () => void
}

export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  const RemoveButton = () => {
    return (
      <Button
        color="info"
        title={`Remove ${props.kind}`}
        onClick={() => props.onRemoveClick()}
      >
        Remove {capitalize(props.kind)}
      </Button>
    )
  }
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={[9, 3]}>
          <Box>
            {capitalize(props.kind)}s <small>/</small> {props.name}
          </Box>
          <RemoveButton />
        </Columns>
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
