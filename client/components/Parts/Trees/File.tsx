import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { alpha, styled } from '@mui/material/styles'
import { keyframes } from '@mui/system'
import { TreeItem, TreeView, TreeItemProps, treeItemClasses } from '@mui/x-tree-view'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import ScrollBox from '../Boxes/Scroll'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface FileTreeProps {
  files: types.IFile[]
  event?: types.IEvent
  selected?: string
  selectedMultiple?: string[]
  onSelect: (paths: string[]) => void
  defaultExpanded?: string[]
}

const Context = React.createContext<{
  event?: FileTreeProps['event']
}>({})

export default function FileTree(props: FileTreeProps) {
  const fileTree = React.useMemo(() => helpers.createFileTree(props.files), [props.files])
  const [expanded, setExpanded] = React.useState<string[]>([])
  React.useEffect(() => {
    const defaultExpanded = props.event
      ? helpers.listParentFolders(props.event.paths)
      : props.defaultExpanded || []
    setExpanded([...new Set([...expanded, ...defaultExpanded])])
  }, [props.event, props.defaultExpanded])
  const selectedMultiple = props.selectedMultiple || []
  const selected = props.selected || ''
  return (
    <Context.Provider value={{ event: props.event }}>
      <ScrollBox sx={{ padding: 2 }} height="100%">
        <Stack alignItems="stretch" height="100%">
          <TreeView
            multiSelect
            selected={selectedMultiple.length > 0 ? selectedMultiple : [selected]}
            expanded={expanded}
            onNodeSelect={(_event, nodeIds) => props.onSelect(nodeIds)}
            onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) => {
              // On collapsing we don't collapse a folder if it's not yet selected
              const isCollapsing = nodeIds.length < expanded.length
              if (isCollapsing && !expanded.every((value) => selected.includes(value)))
                return
              setExpanded(nodeIds)
            }}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            aria-label="customized"
          >
            {fileTree.map((item) => (
              <TreeNode item={item} key={item.path} />
            ))}
          </TreeView>
          <Box
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => props.onSelect([])}
          ></Box>
        </Stack>
      </ScrollBox>
    </Context.Provider>
  )
}

function TreeNode(props: { item: types.IFileTreeItem }) {
  return (
    <StyledTreeItem key={props.item.path} nodeId={props.item.path} item={props.item}>
      {props.item.children.map((item) => (
        <TreeNode item={item} key={item.path} />
      ))}
    </StyledTreeItem>
  )
}

const StyledTreeItem = styled(
  (
    props: TreeItemProps & {
      item: types.IFileTreeItem
    }
  ) => {
    const { item, ...others } = props
    const { event } = React.useContext(Context)
    const animation =
      event &&
      event.paths.includes(props.nodeId) &&
      ['create', 'delete', 'update'].includes(event.type)
        ? `${fileEventKeyframe} 1s`
        : undefined
    return (
      <TreeItem
        {...others}
        sx={{ animation }}
        label={<TreeItemIcon nodeId={props.nodeId} item={item} />}
      />
    )
  }
)(({ theme }) => ({
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

function TreeItemIcon(props: { nodeId: string; item: types.IFileTreeItem }) {
  let color = 'gray'
  if (props.item.type === 'folder') color = 'primary'
  if (props.item.name) color = props.item.errors ? 'red' : 'green'

  const fontWeight = 'normal'
  // When data package is enabled consider highlighting it
  // const fontWeight = props.item.type === 'package' ? 'bold' : 'normal'

  return (
    <Box
      sx={{
        py: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '& div': { mr: 1 },
      }}
    >
      <div style={{height: '8px',
        width: '8px',
        backgroundColor: color,
        borderRadius: '50%',}}>{" "}</div>
      <span style={{ whiteSpace: 'nowrap', fontWeight }}>{props.item.label}</span>
    </Box>
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

// TODO: use color from theme
const fileEventKeyframe = keyframes`
  from {
    background-color: yellow;
  }
  to {
    background-color: inherit;
  }
`
