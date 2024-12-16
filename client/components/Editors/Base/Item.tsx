import * as React from 'react'
import startCase from 'lodash/startCase'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Columns from '../../Parts/Grids/Columns'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export interface EditorItemProps {
  kind: string
  name: string
  isExtras?: boolean
  extrasName?: string
  onExtrasClick?: () => void
  onBackClick: () => void
}

export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  const ExtrasButton = () => {
    if (!props.extrasName) return null
    return (
      <Button
        color={props.isExtras ? 'warning' : undefined}
        title={startCase(props.extrasName)}
        onClick={() => (props.onExtrasClick ? props.onExtrasClick() : undefined)}
        sx={{
          border: '1px solid #D3D7D8',
          color: '#3F4345',
          backgroundColor: '#FAFAFA',
          borderRadius: '4px',
          padding: '4px 10px',
          '&.MuiButton-root': {
            textTransform: 'capitalize',
          },
        }}
      >
        {startCase(props.extrasName)}
      </Button>
    )
  }
  const BackButton = () => {
    const { t } = useTranslation()
    return (
      <Button
        title={t('back')}
        onClick={() => props.onBackClick()}
        startIcon={<ArrowBackIcon />}
        sx={{
          '&.MuiButton-root': {
            textTransform: 'capitalize',
            color: '#A1A8A9',
          },
        }}
      >
        {t('back')}
      </Button>
    )
  }
  return (
    <React.Fragment>
      <Box sx={{ paddingBottom: '10px' }}>
        <Columns spacing={1}>
          <BackButton />
          <Box sx={{ whiteSpace: 'nowrap', alignSelf: 'center' }}>
            <Typography variant="inherit" display="inline" sx={{ color: 'grey' }}>
              <Link onClick={props.onBackClick} sx={{ cursor: 'pointer' }}>
                {startCase(props.kind)}s
              </Link>{' '}
              <small>/</small>
            </Typography>{' '}
            {props.name}
          </Box>
          <Box sx={{ float: 'right' }}>
            <ExtrasButton />
          </Box>
        </Columns>
      </Box>
      {props.children}
    </React.Fragment>
  )
}
