import * as React from 'react'
import startCase from 'lodash/startCase'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Parts/Grids/Columns'
import EditorListItem from './ListItem'
import HeadingBox from './Heading/Box'

export interface EditorListProps {
  kind: string
  query?: string
  isGrid?: boolean
  onAddClick: () => void
  onGridClick: () => void
  // We accept search as a prop otherwise it loses focus
  SearchInput: React.ReactNode
}

export default function EditorList(props: React.PropsWithChildren<EditorListProps>) {
  const AddButton = () => {
    return (
      <Button title={`Add ${startCase(props.kind)}`} onClick={() => props.onAddClick()}>
        Add {startCase(props.kind)}
      </Button>
    )
  }
  const GridButton = () => {
    return (
      <Button
        color={props.isGrid ? 'warning' : undefined}
        onClick={() => props.onGridClick()}
        title="Toggle grid view"
      >
        Grid View
      </Button>
    )
  }
  // TODO: we can make HeadingBox (or with Tabs/Help) "sticky" with CSS:
  // https://developer.mozilla.org/en-US/docs/Web/CSS/position
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={[4, 5, 3]}>
          <Box>{startCase(props.kind)}s</Box>
          <Box sx={{ float: 'right' }}>
            <AddButton />
            <GridButton />
          </Box>
          {props.SearchInput}
        </Columns>
      </HeadingBox>
      {React.Children.count(props.children) > 0 ? (
        props.children
      ) : (
        <EditorListItem
          disabled
          kind={props.kind}
          name={`No ${props.kind}s ${props.query ? 'found' : 'added'}`}
        />
      )}
    </React.Fragment>
  )
}
