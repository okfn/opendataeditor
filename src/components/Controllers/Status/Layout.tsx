import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import InputIcon from '@mui/icons-material/Input'
import InputBase from '@mui/material/InputBase'
import ValidationChip from '../../Parts/Chips/Validation'
import { useStore } from './store'

export default function Layout() {
  const file = useStore((state) => state.file)
  // TODO: review/rework
  // TODO: handle time when indexing happens
  const errorCount = file?.record?.report?.stats?.errors || 0
  return (
    <Search>
      <SearchIconWrapper>
        <InputIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Data management application for browser and desktop"
        inputProps={{ 'aria-label': 'search' }}
        readOnly
        value={file ? file.path : ''}
      />
      {file && (
        <InformationWrapper>
          <ValidationChip errorCount={errorCount} />
        </InformationWrapper>
      )}
    </Search>
  )
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // border: 'dashed 1px #fff',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const InformationWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'right',
  justifyContent: 'right',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& ::file-selector-button': {
    display: 'none',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))
