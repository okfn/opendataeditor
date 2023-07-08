import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ImageIcon from '@mui/icons-material/Image'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SourceIcon from '@mui/icons-material/Source'
import TerminalIcon from '@mui/icons-material/Terminal'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import MultilineField from '../../Parts/Fields/Multiline'
import InputField from '../../Parts/Fields/Input'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import * as types from '../../../types'
import { useStore, selectors } from '../store'

interface IMenuItem extends types.IMenuItem {
  fileName: string
  description: string
  placeholder: string
  promptPlaceholder: string
  Icon: React.ElementType
  create: (path: string, prompt?: string) => Promise<void>
}

export default function CreateFileDialog() {
  const updateState = useStore((state) => state.updateState)
  const createArticle = useStore((state) => state.createArticle)
  const createChart = useStore((state) => state.createChart)
  const createImage = useStore((state) => state.createImage)
  const createPackage = useStore((state) => state.createPackage)
  const createFile = useStore((state) => state.createFile)
  const createScript = useStore((state) => state.createScript)
  const createView = useStore((state) => state.createView)
  const MENU_ITEMS: IMenuItem[] = [
    {
      name: 'Article',
      section: 'article',
      fileName: 'article.md',
      description: 'Creating a Markdown article. Enter destination:',
      placeholder: 'Enter an article path',
      promptPlaceholder: 'story about dogs',
      Icon: HistoryEduIcon,
      create: createArticle,
    },
    {
      name: 'Catalog',
      section: 'catalog',
      fileName: 'catalog.json',
      description: 'Creating a data catalog. Enter destination:',
      placeholder: 'Enter a catalog path',
      promptPlaceholder: '',
      Icon: LibraryBooksIcon,
      // @ts-ignore
      create: () => alert('Under Development'),
    },
    {
      name: 'Chart',
      section: 'chart',
      fileName: 'chart.json',
      description: 'Creating a Vega chart. Enter destination:',
      placeholder: 'Enter a chart path',
      promptPlaceholder: 'bar chart for cars.csv showing average price by brand',
      Icon: LeaderboardIcon,
      create: createChart,
    },
    {
      name: 'Dataset',
      section: 'dataset',
      fileName: 'datapackage.json',
      description: 'Creating a data package. Enter destination:',
      placeholder: 'Enter a package path',
      promptPlaceholder: '',
      Icon: SourceIcon,
      create: createPackage,
    },
    {
      name: 'File',
      section: 'file',
      fileName: '',
      description: 'Creating an arbitrary file. Enter destination:',
      placeholder: 'Enter a file path',
      promptPlaceholder: '',
      Icon: PostAddIcon,
      create: createFile,
    },
    {
      name: 'Image',
      section: 'image',
      fileName: 'image.png',
      description: 'Creating an image. Enter destination:',
      placeholder: 'Enter an image path',
      promptPlaceholder: 'cute dog in cartoon style',
      Icon: ImageIcon,
      create: createImage,
    },
    {
      name: 'Script',
      section: 'script',
      fileName: 'script.py',
      description: 'Creating a Python script. Enter destination:',
      placeholder: 'Enter a script path',
      promptPlaceholder: 'script with basic analysis of cars.csv',
      Icon: TerminalIcon,
      create: createScript,
    },
    {
      name: 'View',
      section: 'view',
      fileName: 'view.json',
      description: 'Creating a SQL view. Enter destination:',
      placeholder: 'Enter a view path',
      promptPlaceholder: '',
      Icon: TableRowsIcon,
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
      title="Create File"
      label="Create"
      Icon={menuItem.Icon}
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
        <Box sx={{ paddingRight: 2, borderRight: 'solid 1px #ddd' }}>
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
                rows={4}
                label="Promtp"
                value={prompt}
                onChange={setPrompt}
                placeholder={menuItem.promptPlaceholder}
              />
            </Box>
          )}
          {loading && (
            <Box sx={{ borderTop: 'solid 1px #ddd', paddingY: 2, maringTop: 2 }}>
              Creating
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Columns>
    </ConfirmDialog>
  )
}
