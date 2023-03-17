import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Columns from '../Columns'
import HeadingBox from './Internals/HeadingBox'

export interface EditorItemProps {
  kind: string
  name: string
  onBackClick: () => void
  onRemoveClick: () => void
}

// TODO: rebase Link on component="button" so it doesn't add "#" to the url
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
            <Typography variant="inherit" display="inline" sx={{ color: 'grey' }}>
              <Link href="#" onClick={props.onBackClick}>
                {capitalize(props.kind)}s
              </Link>{' '}
              <small>/</small>
            </Typography>{' '}
            {props.name}
          </Box>
          <RemoveButton />
        </Columns>
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
