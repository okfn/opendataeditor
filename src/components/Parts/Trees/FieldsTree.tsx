import * as React from 'react'
import TreeItem from '@mui/lab/TreeItem'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { ITreeItem } from '../../../interfaces'

interface FileTreeProps {
  tree: ITreeItem[]
  selected?: string
  expanded?: string[]
  onPathChange?: (path: string) => void
  onFieldSelected?: IOnFieldSelected
}

type IOnFieldSelected = (name: string) => void
const Context = React.createContext<{ onFieldSelected?: IOnFieldSelected }>({})

export default function FieldsTree(props: FileTreeProps) {
  return (
    <Context.Provider value={{ onFieldSelected: props.onFieldSelected }}>
      <Box sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
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
          {props.tree.map((item) => (
            <TreeNode item={item} key={item.path} />
          ))}
        </TreeView>
      </Box>
    </Context.Provider>
  )
}

function TreeNode(props: { item: ITreeItem }) {
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
  const { onFieldSelected } = React.useContext(Context)
  return (
    <Box
      onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
        if (ev.detail === 2 && onFieldSelected) onFieldSelected(props.label)
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
