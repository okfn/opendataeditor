import * as React from 'react'
import Box from '@mui/material/Box'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

// TODO: add section search

export interface MenuTreeProps {
  menuItems: types.IMenuItem[]
  selected?: string
  defaultExpanded?: string[]
  onSelect: (section: string) => void
}

// TODO: improve expanded logic
export default function MenuTree(props: MenuTreeProps) {
  const [expanded, setExpanded] = React.useState(props.defaultExpanded || [])
  const menuTree = React.useMemo(
    () => helpers.createMenuTree(props.menuItems),
    [props.menuItems]
  )
  React.useEffect(() => {
    if (props.selected && !props.selected.includes('/')) {
      if (!expanded.includes(props.selected)) setExpanded([props.selected])
    }
  }, [props.selected])
  return (
    <TreeView
      selected={props.selected || ''}
      expanded={expanded}
      onNodeSelect={(_event, nodeId) => {
        props.onSelect(nodeId as string)
      }}
      onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) => {
        // Here we implemet accordion logic: only one can be extended at time
        const ids = nodeIds.filter((id) => !expanded.includes(id))
        if (ids.length) setExpanded(ids)
      }}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      aria-label="customized"
    >
      {menuTree.map((item) => {
        return <TreeNode item={item} key={`${item.section}-${item.disabled}`} />
      })}
    </TreeView>
  )
}

function TreeNode(props: { item: types.IMenuTreeItem }) {
  return (
    <TreeItem
      nodeId={props.item.section}
      disabled={props.item.disabled}
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
