import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { alpha, styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { useSpring, animated } from 'react-spring'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'
import { ITreeItem } from '../../../interfaces'

interface FileTreeProps {
  tree: ITreeItem[]
  path?: string
  onPathChange: (path: string) => void
}

export default function FileTree(props: FileTreeProps) {
  return (
    <Box sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
      <TreeView
        selected={props.path || ''}
        onNodeFocus={(event: React.SyntheticEvent, nodeId: string) => {
          props.onPathChange(nodeId)
          event.stopPropagation()
        }}
        sx={{ height: '100%' }}
        defaultExpanded={['1']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        aria-label="customized"
      >
        {props.tree.sort(compareNodes).map((item) => (
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
      {props.item.children.sort(compareNodes).map((item) => (
        <TreeNode item={item} key={item.path} />
      ))}
    </StyledTreeItem>
  )
}

const StyledTreeItem = styled((props: TreeItemProps & { type: string }) => (
  <TreeItem
    {...props}
    TransitionComponent={TransitionComponent}
    label={<TreeItemIcon path={props.nodeId} label={props.label} type={props.type} />}
  />
))(({ theme, type }) => ({
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

function TreeItemIcon(props: { path: string; label: React.ReactNode; type: string }) {
  return (
    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
      {props.type === 'folder' ? <FolderIcon color="info" /> : <DescriptionIcon />}
      {props.label}
    </Box>
  )
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
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

// function CloseSquare(props: SvgIconProps) {
//   return (
//     <SvgIcon
//       className="close"
//       fontSize="inherit"
//       style={{ width: 14, height: 14 }}
//       {...props}
//     >
//       {/* tslint:disable-next-line: max-line-length */}
//       <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
//     </SvgIcon>
//   )
// }

function compareNodes(a: any, b: any) {
  if (a.children.length && !b.children.length) return -1
  if (!a.children.length && b.children.length) return 1
  return 0
}
