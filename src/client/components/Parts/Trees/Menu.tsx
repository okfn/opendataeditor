import * as React from 'react'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

// TODO: add section search

export interface MenuTreeProps {
  menuItems: types.IMenuItem[]
  selected?: string
  expanded?: string[]
  onSelect: (section: string) => void
}

export default function MenuTree(props: MenuTreeProps) {
  const sectionTree = React.useMemo(
    () => helpers.createMenuTree(props.menuItems),
    [props.menuItems]
  )
  return (
    <TreeView
      selected={props.selected || ''}
      defaultExpanded={props.expanded}
      onNodeSelect={(_event: React.SyntheticEvent, nodeId: string) => {
        props.onSelect(nodeId)
      }}
      sx={{ height: '100%' }}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      aria-label="customized"
    >
      {sectionTree.map((item) => (
        <TreeNode item={item} key={item.section} />
      ))}
    </TreeView>
  )
}

function TreeNode(props: { item: types.IMenuTreeItem }) {
  return (
    <TreeItem
      key={props.item.section}
      nodeId={props.item.section}
      label={<TreeLabel label={props.item.name} section={props.item.section} />}
    >
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.section} />
      ))}
    </TreeItem>
  )
}

function TreeLabel(props: { label: string; section: string }) {
  return (
    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
      {props.label}
    </Box>
  )
}
