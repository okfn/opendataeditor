import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import CreateButton from './Buttons/CreateButton'
import DeleteButton from './Buttons/DeleteButton'
import ManageButton from './Buttons/ManageButton'

export default function Actions() {
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px' }}>
      <Columns spacing={2}>
        <CreateButton />
        <ManageButton />
        <DeleteButton />
      </Columns>
    </Box>
  )
}
