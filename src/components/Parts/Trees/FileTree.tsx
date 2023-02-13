import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { alpha, styled } from '@mui/material/styles'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'
import ChartIcon from '@mui/icons-material/Leaderboard'
import { ITreeItem } from '../../../interfaces'
import { AccountTree, CheckCircleOutline } from '@mui/icons-material'
import { TableRows, Source, Storage, TableView } from '@mui/icons-material'

interface FileTreeProps {
  tree: ITreeItem[]
  selected?: string
  expanded?: string[]
  fileItemAdded?: boolean
  onExpand?: (newExpanded: string[]) => void
  onFileItemAdd?: (itemAdded: boolean) => void
  onPathChange?: (path: string) => void
}

export default function FileTree(props: FileTreeProps) {
  const [expanded, setExpanded] = React.useState<string[]>(
    props.selected ? [props.selected] : []
  )

  React.useEffect(() => {
    if (props.fileItemAdded && props.selected && !expanded.includes(props.selected)) {
      setExpanded([props.selected, ...expanded])
      props.onFileItemAdd && props.onFileItemAdd(false)
    }
  }, [props.tree])
  return (
    <Box sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
      <TreeView
        selected={props.selected || ''}
        defaultExpanded={props.expanded}
        expanded={expanded}
        onNodeFocus={(event: React.SyntheticEvent, nodeId: string) => {
          if (props.onPathChange) props.onPathChange(nodeId)
          event.stopPropagation()
        }}
        onNodeToggle={(_event, newExpanded) => {
          setExpanded(newExpanded)
        }}
        sx={{ height: '100%' }}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
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
    <StyledTreeItem
      key={props.item.path}
      nodeId={props.item.path}
      label={props.item.name}
      type={props.item.type}
    >
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.path} />
      ))}
    </StyledTreeItem>
  )
}

const StyledTreeItem = styled((props: TreeItemProps & { type: string }) => {
  return (
    <TreeItem {...props} label={<TreeItemIcon label={props.label} type={props.type} />} />
  )
})(({ theme, type }) => ({
  '& .MuiTreeItem-label': {
    fontWeight: type === 'package' ? 'bold' : 'normal',
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))

function TreeItemIcon(props: { label: React.ReactNode; type: string }) {
  return (
    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
      <TypeIcon type={props.type} />
      {props.label}
    </Box>
  )
}

function TypeIcon(props: { type: string }) {
  const icons: { [type: string]: React.ReactElement } = {
    folder: <FolderIcon color="primary" />,
    file: <DescriptionIcon color="primary" />,
    chart: <ChartIcon color="primary" />,
    sql: <Storage color="primary" />,
    table: <TableView color="primary" />,
    package: <Source color="primary" />,
    resource: <DescriptionIcon color="primary" />,
    dialect: <DescriptionIcon color="primary" />,
    checklist: <CheckCircleOutline color="primary" />,
    pipeline: <AccountTree color="primary" />,
    schema: <DescriptionIcon color="primary" />,
    view: <TableRows color="primary" />,
  }
  return icons[props.type] || <DescriptionIcon color="primary" />
}

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  )
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  )
}
