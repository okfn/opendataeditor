import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'
import { ISession } from '../../interfaces'

export interface ProjectProps {
  session?: ISession
  onPathChange: (path?: string) => void
}

export default function Schema(props: ProjectProps) {
  const theme = useTheme()
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: theme.spacing(56) }}>
        <Box sx={{ height: theme.spacing(48), borderTop: 'solid 1px white' }}>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
