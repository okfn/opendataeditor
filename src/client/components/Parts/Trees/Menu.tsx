import * as React from 'react'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import { alpha, styled } from '@mui/material/styles'
// import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
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
      expanded={props.expanded}
      onNodeSelect={(_event: React.SyntheticEvent, nodeId: string) => {
        props.onSelect(nodeId)
      }}
      sx={{ height: '100%' }}
      defaultCollapseIcon={<FolderOpenIcon />}
      defaultExpandIcon={<FolderOpenIcon />}
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
    <StyledTreeItem
      key={props.item.section}
      nodeId={props.item.section}
      label={<TreeLabel label={props.item.name} section={props.item.section} />}
    >
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.section} />
      ))}
    </StyledTreeItem>
  )
}

function TreeLabel(props: { label: string; section: string }) {
  return (
    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
      {props.label}
    </Box>
  )
}

const StyledTreeItem = styled((props: TreeItemProps) => {
  return <TreeItem {...props} />
})(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))

// function MinusSquare(props: SvgIconProps) {
// return (
// <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
// {[> tslint:disable-next-line: max-line-length <]}
// <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
// </SvgIcon>
// )
// }

// function PlusSquare(props: SvgIconProps) {
// return (
// <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
// {[> tslint:disable-next-line: max-line-length <]}
// <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
// </SvgIcon>
// )
// }
