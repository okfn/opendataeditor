import * as React from 'react'
import Box from '@mui/material/Box'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import Columns from '../../Parts/Columns'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  const makeQuery = useStore((state) => state.makeQuery)
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      <Columns spacing={2}>
        <DefaultButton variant="contained" label="Make Query" onClick={makeQuery} />
        <DefaultButton
          variant="contained"
          color="secondary"
          label="Save Table"
          onClick={() => {}}
        />
      </Columns>
    </Box>
  )
}
