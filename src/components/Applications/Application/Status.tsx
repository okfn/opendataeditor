import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import InputIcon from '@mui/icons-material/Input'
import ReportChip from '../../Parts/Chips/Report'
import ChartChip from '../../Parts/Chips/Chart'
import ViewChip from '../../Parts/Chips/View'
import ScriptChip from '../../Parts/Chips/Script'
import { useStore, selectors } from './store'

export default function Status() {
  const file = useStore(selectors.file)
  const createChart = useStore((state) => state.createChart)
  const createView = useStore((state) => state.createView)
  return (
    <Container>
      <Prefix>
        <InputIcon />
      </Prefix>
      <Contents>{file ? file.path : 'Data management for humans'}</Contents>
      <Suffix>
        <ScriptChip onClick={() => alert('under development')} />
        <ViewChip onClick={() => createView()} />
        <ChartChip onClick={() => createChart()} />
        <ReportChip errorCount={file?.errors} />
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
