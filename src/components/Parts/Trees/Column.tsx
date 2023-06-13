import * as React from 'react'
import TreeItem from '@mui/lab/TreeItem'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

interface ColumnTreeProps {
  columns: types.IColumn[]
  selected?: string
  expanded?: string[]
  onPathChange?: (path: string) => void
  onPathDoubleClick?: (path: string) => void
}

const Context = React.createContext<{
  onPathDoubleClick?: ColumnTreeProps['onPathDoubleClick']
}>({})

export default function ColumnTree(props: ColumnTreeProps) {
  const columnTree = React.useMemo(
    () => helpers.createColumnTree(props.columns),
    [props.columns]
  )
  return (
    <Context.Provider value={{ onPathDoubleClick: props.onPathDoubleClick }}>
      <Box sx={{ padding: 2 }}>
        <TreeView
          selected={props.selected || ''}
          defaultExpanded={props.expanded}
          onNodeFocus={(event: React.SyntheticEvent, nodeId: string) => {
            if (props.onPathChange) props.onPathChange(nodeId)
            event.stopPropagation()
          }}
          sx={{ height: '100%' }}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          aria-label="customized"
        >
          {columnTree.map((item) => (
            <TreeNode item={item} key={item.path} />
          ))}
        </TreeView>
      </Box>
    </Context.Provider>
  )
}

function TreeNode(props: { item: types.IColumnTreeItem }) {
  return (
    <TreeItem
      key={props.item.path}
      nodeId={props.item.path}
      label={
        <TreeLabel
          label={props.item.name}
          type={props.item.type}
          path={props.item.path}
        />
      }
    >
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.path} />
      ))}
    </TreeItem>
  )
}

function TreeLabel(props: { label: string; type: string; path: string }) {
  const { onPathDoubleClick } = React.useContext(Context)
  return (
    <Box
      onClick={(ev: React.MouseEvent<HTMLElement>) => {
        if (ev.detail === 2 && onPathDoubleClick) onPathDoubleClick(props.label)
      }}
      sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}
    >
      {props.label}{' '}
      <Box sx={{ color: '#4d4d4d', paddingLeft: '10px' }}>
        {props.type === 'table' ? props.path : props.type.toUpperCase()}
      </Box>
    </Box>
  )
}
