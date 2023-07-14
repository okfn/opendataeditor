import * as React from 'react'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

interface ColumnTreeProps {
  columns: types.IColumn[]
  selected?: string
  defaultExpanded?: string[]
  onPathChange?: (path: string) => void
  onPathDoubleClick?: (path: string) => void
}

const Context = React.createContext<{
  onPathDoubleClick?: ColumnTreeProps['onPathDoubleClick']
}>({})

export default function ColumnTree(props: ColumnTreeProps) {
  const [expanded, setExpanded] = React.useState(props.defaultExpanded || [])
  const columnTree = React.useMemo(
    () => helpers.createColumnTree(props.columns),
    [props.columns]
  )
  return (
    <Context.Provider value={{ onPathDoubleClick: props.onPathDoubleClick }}>
      <Box sx={{ padding: 2 }}>
        <TreeView
          selected={props.selected || ''}
          expanded={expanded}
          onNodeSelect={(_event: React.SyntheticEvent, nodeId: string) => {
            if (props.onPathChange) props.onPathChange(nodeId)
          }}
          onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) => {
            // On collapsing we don't collapse a folder if it's not yet selected
            const isCollapsing = nodeIds.length < expanded.length
            if (isCollapsing && !expanded.includes(props.selected || '')) return
            setExpanded(nodeIds)
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
