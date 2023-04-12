import * as React from 'react'
import TreeItem from '@mui/lab/TreeItem'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { ITreeItem } from '../../../interfaces'

interface BaseTreeProps {
  tree: ITreeItem[]
  selected?: string
  expanded?: string[]
  onPathChange?: (path: string) => void
}

export default function BaseTree(props: BaseTreeProps) {
  return (
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
  )
}

function TreeNode(props: { item: ITreeItem }) {
  return (
    <TreeItem key={props.item.path} nodeId={props.item.path} label={props.item.name}>
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.path} />
      ))}
    </TreeItem>
  )
}
