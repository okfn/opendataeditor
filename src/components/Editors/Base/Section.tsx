import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Parts/Columns'
import HeadingBox from './Heading/Box'

export interface EditorItemProps {
  name: string
  onHeadingClick?: () => void
  onBackClick?: () => void
}

export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  const BackButton = () => {
    if (!props.onBackClick) return null
    return (
      <Button
        title="Back to list"
        onClick={() => props.onBackClick && props.onBackClick()}
      >
        Back to list
      </Button>
    )
  }
  return (
    <React.Fragment>
      <HeadingBox onClick={() => props.onHeadingClick && props.onHeadingClick()}>
        <Columns spacing={1} layout={[6, 6]}>
          <Box>{props.name}</Box>
          <Box sx={{ float: 'right' }}>
            <BackButton />
          </Box>
        </Columns>
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
