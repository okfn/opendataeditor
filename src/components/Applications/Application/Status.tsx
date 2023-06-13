import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import InputIcon from '@mui/icons-material/Input'
import LightTooltip from '../../Parts/Tooltips/Light'
import ReportChip from '../../Parts/Chips/Report'
import ChartChip from '../../Parts/Chips/Chart'
import ViewChip from '../../Parts/Chips/View'
import ScriptChip from '../../Parts/Chips/Script'
import { useStore } from './store'

export default function Status() {
  const record = useStore((state) => state.record)
  const measure = useStore((state) => state.measure)
  const createView = useStore((state) => state.createView)
  const createChart = useStore((state) => state.createChart)
  const locateFile = useStore((state) => state.locateFile)
  return (
    <Container>
      <Prefix>
        <InputIcon />
      </Prefix>
      <LightTooltip
        title={
          record
            ? 'Locate this file in the browser'
            : 'Select a file in the browser to explore'
        }
        placement="bottom-start"
      >
        <Contents onClick={record ? () => locateFile(record.path) : undefined}>
          {record ? record.path : 'Data management for humans'}
        </Contents>
      </LightTooltip>
      <Suffix>
        <ScriptChip onClick={() => alert('under development')} />
        <ViewChip onClick={() => createView()} />
        <ChartChip onClick={() => createChart()} />
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
  padding: theme.spacing(1, 1, 1, 0),
  // vertical padding + font size from searchIcon
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create('width'),
  cursor: 'pointer',
}))

const Prefix = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
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
