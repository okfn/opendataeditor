import * as React from 'react'
import { SyntheticEvent } from 'react'
import { useSpring, animated } from 'react-spring'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem'
import Collapse from '@mui/material/Collapse'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { alpha, styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { useStore } from '../../Editors/Files/store'
import Box from '@mui/material/Box'
import { isDirectory } from '../../../helpers'
import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'

interface FileNavigatorProps {
  initialState?: {
    mouseX: number | null
    mouseY: number | null
  } | null
  onFolderSelect: (destinationDirectory: string | null) => void
}
export default function FileNavigator(props: FileNavigatorProps) {
  const path = useStore((state: any) => state.path)
  const directories = useStore((state: any) => state.directories)
  const listFolders = useStore((state: any) => state.listFolders)
  const tree = indexTree(createTree(directories))

  const handleSelect = (_: SyntheticEvent, nodeId: string) => {
    let newpath = nodeId.slice(nodeId.indexOf('/', 1) + 1)
    if (newpath === 'root') newpath = ''
    props.onFolderSelect(newpath)
  }
  React.useEffect(() => {
    listFolders().catch(console.error)
  }, [])
  return (
    <React.Fragment>
      <TreeView
        aria-label="file navigator"
        defaultExpanded={['1']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        onNodeSelect={handleSelect}
        selected={path || ''}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          height: 240,
          overflowY: 'auto',
          maxWidth: 400,
        }}
      >
        {tree.sort(compareNodes).map((node: any) => (
          <TreeNode node={node} key={node.path} />
        ))}
      </TreeView>
    </React.Fragment>
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

function TreeItemIcon({ path, label }: any) {
  return (
    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
      {isDirectory(path) ? <FolderIcon color="info" /> : <DescriptionIcon />}
      {label}
    </Box>
  )
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem
    {...props}
    TransitionComponent={TransitionComponent}
    label={<TreeItemIcon path={props.nodeId} label={props.label} />}
  />
))(({ theme }) => ({
  '& .MuiTreeItem-label': 'normal',
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

function TreeNode({ node }: any) {
  return (
    <StyledTreeItem key={node.path} nodeId={node.path} label={node.name}>
      {node.children.sort(compareNodes).map((node: any) => (
        <TreeNode node={node} key={node.path} />
      ))}
    </StyledTreeItem>
  )
}

function createTree(paths: string[]) {
  const result: any = []
  const level = { result }
  paths = paths.map(function (path) {
    return `root/${path}`
  })
  paths &&
    paths.forEach((path) => {
      ;(path as string).split('/').reduce((r: any, name) => {
        if (!r[name]) {
          r[name] = { result: [] }
          r.result.push({ name, children: r[name].result })
        }
        return r[name]
      }, level)
    })
  return result
}

function indexTree(tree: any, basepath: string = '') {
  for (const item of tree) {
    item.path = basepath ? [basepath, item.name].join('/') : item.name
    if (item.children) indexTree(item.children, item.path)
  }
  return tree
}

function compareNodes(a: any, b: any) {
  if (a.children.length && !b.children.length) return -1
  if (!a.children.length && b.children.length) return 1
  return 0
}
