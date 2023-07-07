import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ImageIcon from '@mui/icons-material/Image'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SourceIcon from '@mui/icons-material/Source'
import TerminalIcon from '@mui/icons-material/Terminal'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LightTooltip from '../../Parts/Tooltips/Light'
import BaseDialog from '../../Parts/Dialogs/Base'
import { useStore } from '../store'

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  return (
    <BaseDialog
      open={true}
      maxWidth="md"
      onCancel={() => updateState({ dialog: undefined })}
    >
      <Grid container sx={{ border: 'solid 1px #fff' }}>
        {ITEMS.map((item) => (
          <Grid key={item.label} item md={3}>
            <Box sx={{ height: '200px' }}>
              <LightTooltip title={item.tooltip}>
                <Chip
                  onClick={() => updateState({ dialog: item.dialog as any })}
                  color="primary"
                  label={item.label}
                  icon={<item.Icon sx={{ fontSize: '2em' }} />}
                  size="medium"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0px',
                    borderRight: 'solid 1px #fff',
                    borderBottom: 'solid 1px #fff',
                    fontSize: '2em',
                  }}
                />
              </LightTooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    </BaseDialog>
  )
}

const ITEMS = [
  {
    label: 'Article',
    dialog: 'createArticle',
    Icon: HistoryEduIcon,
    tooltip: 'Create a Markdown article',
  },
  {
    label: 'Catalog',
    dialog: 'createCatalog',
    Icon: LibraryBooksIcon,
    tooltip: 'Create a data catalog',
  },
  {
    label: 'Chart',
    dialog: 'createChart',
    Icon: LeaderboardIcon,
    tooltip: 'Create a Vega chart',
  },
  {
    label: 'Dataset',
    dialog: 'createDataset',
    Icon: SourceIcon,
    tooltip: 'Create a data package',
  },
  {
    label: 'File',
    dialog: 'createFile',
    Icon: PostAddIcon,
    tooltip: 'Create an arbitrary file',
  },
  {
    label: 'Image',
    dialog: 'createImage',
    Icon: ImageIcon,
    tooltip: 'Create an image',
  },
  {
    label: 'Script',
    dialog: 'createScript',
    Icon: TerminalIcon,
    tooltip: 'Create a Python script',
  },
  {
    label: 'View',
    dialog: 'createView',
    Icon: TableRowsIcon,
    tooltip: 'Create a SQL view',
  },
]
