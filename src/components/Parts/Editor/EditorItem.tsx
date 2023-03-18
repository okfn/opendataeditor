import * as React from 'react'
import startCase from 'lodash/startCase'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Columns from '../Columns'
import HeadingBox from './Internals/HeadingBox'

export interface EditorItemProps {
  kind: string
  name: string
  isExtras?: boolean
  extrasName?: string
  onExtrasClick?: () => void
  onRemoveClick: () => void
  onBackClick: () => void
}

// TODO: rebase Link on component="button" so it doesn't add "#" to the url
export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  const ExtrasButton = () => {
    if (!props.extrasName) return null
    return (
      <Button
        color={props.isExtras ? 'warning' : 'info'}
        title={props.extrasName}
        onClick={() => (props.onExtrasClick ? props.onExtrasClick() : undefined)}
      >
        {startCase(props.extrasName)}
      </Button>
    )
  }
  const RemoveButton = () => {
    return (
      <Button
        color="info"
        title={`Remove ${props.kind}`}
        onClick={() => props.onRemoveClick()}
      >
        Remove {startCase(props.kind)}
      </Button>
    )
  }
  const BackButton = () => {
    return (
      <Button color="info" title="Back to list" onClick={() => props.onBackClick()}>
        Back to list
      </Button>
    )
  }
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={[6, 6]}>
          <Box>
            <Typography variant="inherit" display="inline" sx={{ color: 'grey' }}>
              <Link href="#" onClick={props.onBackClick}>
                {startCase(props.kind)}s
              </Link>{' '}
              <small>/</small>
            </Typography>{' '}
            {props.name}
          </Box>
          <Box sx={{ float: 'right' }}>
            <BackButton />
            <ExtrasButton />
            <RemoveButton />
          </Box>
        </Columns>
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
