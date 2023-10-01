import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import MultilineField from '../../Parts/Fields/Multiline'
import InputField from '../../Parts/Fields/Input'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import * as settings from '../../../settings'
import * as types from '../../../types'
import { useStore, selectors } from '../store'

interface IMenuItem extends types.IMenuItem {
  fileName: string
  description: string
  placeholder: string
  promptPlaceholder: string
  create: (path: string, prompt?: string) => Promise<void>
}

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  const createArticle = useStore((state) => state.createArticle)
  const createChart = useStore((state) => state.createChart)
  const createImage = useStore((state) => state.createImage)
  const createMap = useStore((state) => state.createMap)
  const createPackage = useStore((state) => state.createPackage)
  const createFile = useStore((state) => state.createFile)
  const createScript = useStore((state) => state.createScript)
  const createTable = useStore((state) => state.createTable)
  const createView = useStore((state) => state.createView)
  const MENU_ITEMS: IMenuItem[] = [
    {
      name: 'Article',
      section: 'article',
      fileName: 'article.md',
      description: 'Creating a Markdown article. Enter destination:',
      placeholder: 'Enter an article path',
      promptPlaceholder: 'story about dogs',
      create: createArticle,
    },
    {
      name: 'Chart',
      section: 'chart',
      fileName: 'chart.json',
      description: 'Creating a Vega chart. Enter destination:',
      placeholder: 'Enter a chart path',
      promptPlaceholder: 'bar chart for @cars with average price by brand',
      create: createChart,
    },
    {
      name: 'Dataset',
      section: 'dataset',
      fileName: 'datapackage.json',
      description: 'Creating a dataset. Enter destination:',
      placeholder: 'Enter a package path',
      promptPlaceholder: 'all tables in data folder',
      create: createPackage,
    },
    {
      name: 'File',
      section: 'file',
      fileName: '',
      description: 'Creating an arbitrary file. Enter destination:',
      placeholder: 'Enter a file path',
      promptPlaceholder: 'dummy data in json with name and age',
      create: createFile,
    },
    {
      name: 'Image',
      section: 'image',
      fileName: 'image.png',
      description: 'Creating an image. Enter destination:',
      placeholder: 'Enter an image path',
      promptPlaceholder: 'cute dog in cartoon style',
      create: createImage,
    },
    {
      name: 'Map',
      section: 'map',
      fileName: 'map.geojson',
      description: 'Creating a map. Enter destination:',
      placeholder: 'Enter a map path',
      promptPlaceholder: 'london and paris',
      create: createMap,
    },
    {
      name: 'Script',
      section: 'script',
      fileName: 'script.py',
      description: 'Creating a Python script. Enter destination:',
      placeholder: 'Enter a script path',
      promptPlaceholder: 'average price by brand for @cars',
      create: createScript,
    },
    {
      name: 'Table',
      section: 'table',
      fileName: 'table.csv',
      description: 'Creating a CSV table. Enter destination:',
      placeholder: 'Enter a table path',
      promptPlaceholder: 'continents with population',
      create: createTable,
    },
    {
      name: 'View (SQL)',
      section: 'view',
      fileName: 'view.json',
      description: 'Creating a view (SQL). Enter destination:',
      placeholder: 'Enter a view path',
      promptPlaceholder: 'average price by brand for @cars',
      create: createView,
    },
  ]

  const folderPath = useStore(selectors.folderPath)
  const [path, setPath] = React.useState(folderPath ? `${folderPath}/` : '')
  const [prompt, setPrompt] = React.useState('')
  const [section, setSection] = React.useState('file')
  const [loading, setLoading] = React.useState(false)
  const menuItem = MENU_ITEMS.find((item) => item.section === section)
  if (!menuItem) return null

  const handleSectionChange = (newSection: string) => {
    if (section === newSection) return
    const menuItem = MENU_ITEMS.find((item) => item.section === newSection)
    if (!menuItem) return
    setPath(folderPath ? `${folderPath}/${menuItem.fileName}` : menuItem.fileName)
    setPrompt('')
    setSection(newSection)
  }

  return (
    <ConfirmDialog
      ctrlEnter
      open={true}
      maxWidth="md"
      title={`Create ${menuItem.name}`}
      label="Create"
      Icon={settings.TYPE_ICONS[section]}
      disabled={loading}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        if (!menuItem) return
        setLoading(true)
        await menuItem.create(path, prompt)
        setLoading(false)
        updateState({ dialog: undefined })
      }}
    >
      <Columns layout={[3, 9]} spacing={2}>
        <Box sx={{ paddingRight: 2, marginBottom: 1, borderRight: 'solid 1px #ddd' }}>
          <MenuTree
            menuItems={MENU_ITEMS}
            selected={section}
            onSelect={handleSectionChange}
          />
        </Box>
        <Box>
          {menuItem.description}
          <InputField
            autoFocus
            label="Path"
            value={path}
            onChange={setPath}
            placeholder={menuItem.placeholder}
          />
          {menuItem.promptPlaceholder && (
            <Box>
              Provide a Chat AI prompt (optional):
              <MultilineField
                rows={6}
                label="Prompt"
                value={prompt}
                onChange={setPrompt}
                placeholder={menuItem.promptPlaceholder}
              />
            </Box>
          )}
          {loading && (
            <Box sx={{ borderTop: 'solid 1px #ddd', paddingY: 2, marginTop: 1 }}>
              Creating
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Columns>
    </ConfirmDialog>
  )
}
