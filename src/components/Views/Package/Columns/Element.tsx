import * as React from 'react'
import { assert } from 'ts-essentials'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Columns from '../../Library/Columns'
import HeadingBox from '../../Library/Groups/HeadingBox'
import HeadingButton from '../../Library/Groups/HeadingButton'
import HeadingSearch from '../../Library/Groups/HeadingSearch'
import HeadingSelector from '../../Library/Groups/HeadingSelector'
import Resources from '../Elements/Resources'
import Resource from '../Elements/Resource'
import { useStore, selectors } from '../store'

export default function Element() {
  return (
    <Box>
      <Header />
      <Content />
    </Box>
  )
}

function Header() {
  const elementIndex = useStore((state) => state.elementIndex)
  return elementIndex === undefined ? <ListingHeader /> : <ItemHeader />
}

function ListingHeader() {
  const elementType = useStore((state) => state.elementType)
  return (
    <HeadingBox>
      <Columns spacing={1} layout={[3, 6, 3]}>
        <TypeSelect />
        <Box>
          {elementType === 'resource' ? <AddResourceButton /> : <AddButton />}
          <GridButton />
        </Box>
        <SearchInput />
      </Columns>
    </HeadingBox>
  )
}

function ItemHeader() {
  return (
    <HeadingBox variant="h6">
      <Columns spacing={3}>
        <Columns spacing={1}>
          <BackButton />
          <ItemSelect />
        </Columns>
        <Box>
          <RemoveButton />
          <ExtraButton />
        </Box>
      </Columns>
    </HeadingBox>
  )
}

function TypeSelect() {
  const elementType = useStore((state) => state.elementType)
  const setElementType = useStore((state) => state.setElementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      margin="none"
      value={elementType}
      onChange={(ev) => {
        setElementType(ev.target.value as typeof elementType)
        setElementIndex()
      }}
    >
      {Object.values(ELEMENTS).map((element) => (
        <MenuItem key={element.type} value={element.type}>
          {element.label}s
        </MenuItem>
      ))}
    </HeadingSelector>
  )
}

function AddButton() {
  const elementType = useStore((state) => state.elementType)
  const addElement = useStore((state) => state.addElement)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <Button
      color="info"
      title={`Add a new ${ELEMENT.label.toLowerCase()}`}
      onClick={() => addElement()}
    >
      Add {ELEMENT.label}
    </Button>
  )
}

function AddResourceButton() {
  const loadPaths = useStore((state) => state.loadPaths)
  if (!loadPaths) return null
  const [open, setOpen] = React.useState(false)
  const [paths, setPaths] = React.useState([] as string[])
  const onToggle = () => {
    if (!open) {
      loadPaths().then(setPaths).catch(console.error)
    }
    setOpen(!open)
  }
  const onClose = () => {
    setOpen(false)
  }
  return (
    <React.Fragment>
      <Button color="info" title="Add a new resource" onClick={onToggle}>
        Add Resource
      </Button>
      <AddResourceDialog open={open} paths={paths} onClose={onClose} />
    </React.Fragment>
  )
}

function AddResourceDialog(props: {
  open: boolean
  paths: string[]
  onClose: () => void
}) {
  // const loadResource = useStore((state) => state.loadResource)
  // if (!loadResource) return null
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Select Resources</DialogTitle>
      {props.paths.map((path) => (
        <div key={path}>{path}</div>
      ))}
    </Dialog>
  )
}

function GridButton() {
  const isElementGrid = useStore((state) => state.isElementGrid)
  const toggleIsElementGrid = useStore((state) => state.toggleIsElementGrid)
  return (
    <Button
      color={isElementGrid ? 'warning' : 'info'}
      onClick={() => toggleIsElementGrid()}
      title="Toggle grid view"
    >
      Grid View
    </Button>
  )
}

function BackButton() {
  const elementType = useStore((state) => state.elementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <HeadingButton
      fullWidth
      color="info"
      variant="outlined"
      onClick={() => setElementIndex()}
      title={`Return to ${ELEMENT.label.toLowerCase()}s`}
    >
      {ELEMENT.label}s
    </HeadingButton>
  )
}

export function ItemSelect() {
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const ELEMENT = ELEMENTS[elementType]
  const names = useStore(ELEMENT.names)
  assert(elementIndex !== undefined)
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      type="number"
      value={elementIndex}
      onChange={(ev) => setElementIndex(parseInt(ev.target.value))}
    >
      {names.map((name, index) => (
        <MenuItem key={index} value={index}>
          {name}
        </MenuItem>
      ))}
    </HeadingSelector>
  )
}

function RemoveButton() {
  const elementType = useStore((state) => state.elementType)
  const removeElement = useStore((state) => state.removeElement)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <Button
      title={`Remove ${ELEMENT.label.toLowerCase()}`}
      color="info"
      onClick={() => removeElement()}
    >
      Remove {ELEMENT.label}
    </Button>
  )
}

function ExtraButton() {
  const elementType = useStore((state) => state.elementType)
  const isElementExtra = useStore((state) => state.isElementExtra)
  const toggleIsElementExtra = useStore((state) => state.toggleIsElementExtra)
  const ELEMENT = ELEMENTS[elementType]
  if (!ELEMENT.extra) return null
  return (
    <Button
      color={isElementExtra ? 'warning' : 'info'}
      onClick={() => toggleIsElementExtra()}
      title="Toggle constraints view"
    >
      {ELEMENT.extraLabel}
    </Button>
  )
}

function SearchInput() {
  const elementQuery = useStore((state) => state.elementQuery)
  const setElementQuery = useStore((state) => state.setElementQuery)
  return (
    <HeadingSearch
      value={elementQuery}
      onChange={(elementQuery) => setElementQuery(elementQuery)}
    />
  )
}

function Content() {
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const isElementExtra = useStore((state) => state.isElementExtra)
  const ELEMENT = ELEMENTS[elementType]
  let Component = ELEMENT.item
  if (elementIndex === undefined) Component = ELEMENT.list
  if (isElementExtra && ELEMENT.extra) Component = ELEMENT.extra
  return <Component />
}

const ELEMENTS = {
  resource: {
    type: 'resource',
    label: 'Resource',
    item: Resource,
    list: Resources,
    extra: null,
    extraLabel: null,
    names: selectors.resourceNames,
  },
}
