import * as React from 'react'
import Box from '@mui/material/Box'
import { alpha, styled } from '@mui/material/styles'
// import InputIcon from '@mui/icons-material/Input'
import LightTooltip from '../Parts/Tooltips/Light'
import ReportChip from '../Parts/Chips/Report'
import CreateChip from '../Parts/Chips/Create'
import TypeChip from '../Parts/Chips/Type'
import { useStore } from './store'

export default function Status() {
  const record = useStore((state) => state.record)
  const measure = useStore((state) => state.measure)
  const locateFile = useStore((state) => state.locateFile)
  const updateState = useStore((state) => state.updateState)
  return (
    <Container>
      <Prefix>
        <TypeChip type={record?.type} />
      </Prefix>
      <Contents onClick={record ? () => locateFile(record.path) : undefined}>
        <Box>
          <LightTooltip
            title={
              record
                ? 'Locate this file in the browser'
                : 'Select a file in the browser to explore'
            }
            placement="bottom-start"
          >
            <Box>
              {record ? (
                <span>
                  {record.path}
                  <span style={{ marginLeft: '0.7em', opacity: 0.7 }}>
                    @{record.name}
                  </span>
                </span>
              ) : (
                'Data editor for humans'
              )}
            </Box>
          </LightTooltip>
        </Box>
      </Contents>
      <Suffix>
        <CreateChip onClick={() => updateState({ dialog: 'create' })} />
        <ReportChip errorCount={measure ? measure.errors : undefined} />
      </Suffix>
    </Container>
  )
}

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  border: 'solid 1px #ddd',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const Contents = styled('div')(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  padding: theme.spacing(1, 1, 1, '0.7em'),
  marginLeft: '8vw',
  transition: theme.transitions.create('width'),
  cursor: 'pointer',
}))

const Prefix = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const Suffix = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'right',
  justifyContent: 'right',
}))
