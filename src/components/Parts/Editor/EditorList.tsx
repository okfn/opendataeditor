import * as React from 'react'
import startCase from 'lodash/startCase'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../Columns'
import EditorListItem from './EditorListItem'
import HeadingBox from './Internals/HeadingBox'
import HeadingSearch from './Internals/HeadingSearch'

export interface EditorListProps {
  kind: string
  query?: string
  isGrid?: boolean
  onAddClick: () => void
  onGridClick: () => void
  onQueryChange: (query: string) => void
}

export default function EditorList(props: React.PropsWithChildren<EditorListProps>) {
  const AddButton = () => {
    return (
      <Button
        color="info"
        title={`Add a new ${props.kind}`}
        onClick={() => props.onAddClick()}
      >
        Add {startCase(props.kind)}
      </Button>
    )
  }
  const GridButton = () => {
    return (
      <Button
        color={props.isGrid ? 'warning' : 'info'}
        onClick={() => props.onGridClick()}
        title="Toggle grid view"
      >
        Grid View
      </Button>
    )
  }
  // TODO: fix focus problem
  const SearchInput = () => {
    return (
      <HeadingSearch
        value={props.query || ''}
        onChange={(query) => (query ? props.onQueryChange(query) : undefined)}
      />
    )
  }
  // TODO: Fix heading geometry (not buttons with the second line)
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={[6, 3, 3]}>
          <Box>{startCase(props.kind)}s</Box>
          <Columns>
            <AddButton />
            <GridButton />
          </Columns>
          <SearchInput />
        </Columns>
      </HeadingBox>
      {React.Children.count(props.children) ? (
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
