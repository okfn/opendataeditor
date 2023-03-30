import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import CreateButton from './Buttons/CreateButton'
import DeleteButton from './Buttons/DeleteButton'
import ManageButton from './Buttons/ManageButton'

export default function Actions() {
  // TODO: fix geometry
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box
      sx={{ borderTop: 'solid 1px #ddd', lineHeight: '58px', backgroundColor: '#fafafa' }}
    >
      <Columns spacing={2}>
        <CreateButton />
        <ManageButton />
        <DeleteButton />
      </Columns>
    </Box>
  )
}
