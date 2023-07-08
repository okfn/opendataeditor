import * as React from 'react'
import Box from '@mui/material/Box'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ImageIcon from '@mui/icons-material/Image'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SourceIcon from '@mui/icons-material/Source'
import TerminalIcon from '@mui/icons-material/Terminal'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import InputField from '../../Parts/Fields/Input'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import * as types from '../../../types'
import { useStore, selectors } from '../store'

export default function CreateDialog() {
  const folderPath = useStore(selectors.folderPath)
  const updateState = useStore((state) => state.updateState)
  const createArticle = useStore((state) => state.createArticle)
  const [path, setPath] = React.useState(folderPath ? `${folderPath}/` : '')
  const [section, setSection] = React.useState('file')
  const menuItem = MENU_ITEMS.find((item) => item.section === section)
  if (!menuItem) return null

  const handleSectionChange = (newSection: string) => {
    if (section === newSection) return
    const menuItem = MENU_ITEMS.find((item) => item.section === newSection)
    if (!menuItem) return
    setPath(folderPath ? `${folderPath}/${menuItem.fileName}` : menuItem.fileName)
    setSection(newSection)
  }

  return (
    <ConfirmDialog
      open={true}
      maxWidth="md"
      title="Create New File"
      label="Create"
      Icon={menuItem.Icon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        if (menuItem.section === 'article') {
          await createArticle(path)
        }
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
        </Box>
      </Columns>
    </ConfirmDialog>
  )
}

interface IMenuItem extends types.IMenuItem {
  fileName: string
  description: string
  placeholder: string
  Icon: any
}

const MENU_ITEMS: IMenuItem[] = [
  {
    name: 'Article',
    section: 'article',
    fileName: 'article.md',
    description: 'Creating a Markdown article. Enter destination:',
    placeholder: 'Enter an article path',
    Icon: HistoryEduIcon,
  },
  {
    name: 'Catalog',
    section: 'catalog',
    fileName: 'catalog.json',
    description: 'Creating a data catalog. Enter destination:',
    placeholder: 'Enter a catalog path',
    Icon: LibraryBooksIcon,
  },
  {
    name: 'Chart',
    section: 'chart',
    fileName: 'chart.json',
    description: 'Creating a Vega chart. Enter destination:',
    placeholder: 'Enter a chart path',
    Icon: LeaderboardIcon,
  },
  {
    name: 'Dataset',
    section: 'dataset',
    fileName: 'datapackage.json',
    description: 'Creating a data package. Enter destination:',
    placeholder: 'Enter a package path',
    Icon: SourceIcon,
  },
  {
    name: 'File',
    section: 'file',
    fileName: '',
    description: 'Creating an arbitrary file. Enter destination:',
    placeholder: 'Enter a file path',
    Icon: PostAddIcon,
  },
  {
    name: 'Image',
    section: 'image',
    fileName: 'image.png',
    description: 'Creating an image. Enter destination:',
    placeholder: 'Enter an image path',
    Icon: ImageIcon,
  },
  {
    name: 'Script',
    section: 'script',
    fileName: 'script.py',
    description: 'Creating a Python script. Enter destination:',
    placeholder: 'Enter a script path',
    Icon: TerminalIcon,
  },
  {
    name: 'View',
    section: 'view',
    fileName: 'view.json',
    description: 'Creating a SQL view. Enter destination:',
    placeholder: 'Enter a view path',
    Icon: TableRowsIcon,
  },
]
