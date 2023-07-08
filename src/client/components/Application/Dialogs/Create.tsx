import * as React from 'react'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ImageIcon from '@mui/icons-material/Image'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SourceIcon from '@mui/icons-material/Source'
import TerminalIcon from '@mui/icons-material/Terminal'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import * as types from '../../../types'
import { useStore } from '../store'

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  const [section, setSection] = React.useState('file')
  const menuItem = MENU_ITEMS.find((item) => item.section === section)
  if (!menuItem) return null
  return (
    <ConfirmDialog
      open={true}
      title="Create New File"
      label="Create"
      Icon={AddIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        updateState({ dialog: undefined })
      }}
    >
      <Columns>
        <MenuTree menuItems={MENU_ITEMS} selected={section} onSelect={setSection} />
        <Box>{menuItem.description}</Box>
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
    description: 'Create a Markdown article. Enter destination:',
    placeholder: 'Enter an article path',
    Icon: HistoryEduIcon,
  },
  {
    name: 'Catalog',
    section: 'catalog',
    fileName: 'catalog.json',
    description: 'Create a data catalog. Enter destination:',
    placeholder: 'Enter a catalog path',
    Icon: LibraryBooksIcon,
  },
  {
    name: 'Chart',
    section: 'chart',
    fileName: 'chart.json',
    description: 'Create a Vega chart. Enter destination:',
    placeholder: 'Enter a chart path',
    Icon: LeaderboardIcon,
  },
  {
    name: 'Dataset',
    section: 'dataset',
    fileName: 'datapackage.json',
    description: 'Create a data package. Enter destination:',
    placeholder: 'Enter a package path',
    Icon: SourceIcon,
  },
  {
    name: 'File',
    section: 'file',
    fileName: '',
    description: 'Create an arbitrary file. Enter destination:',
    placeholder: 'Enter a file path',
    Icon: PostAddIcon,
  },
  {
    name: 'Image',
    section: 'image',
    fileName: 'image.png',
    description: 'Create an image. Enter destination:',
    placeholder: 'Enter an image path',
    Icon: ImageIcon,
  },
  {
    name: 'Script',
    section: 'script',
    fileName: 'script.py',
    description: 'Create a Python script. Enter destination:',
    placeholder: 'Enter a script path',
    Icon: TerminalIcon,
  },
  {
    name: 'View',
    section: 'view',
    fileName: 'view.json',
    description: 'Create a SQL view. Enter destination:',
    placeholder: 'Enter a view path',
    Icon: TableRowsIcon,
  },
]
