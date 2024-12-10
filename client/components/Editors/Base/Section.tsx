import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Parts/Grids/Columns'
import HeadingBox from './Heading/Box'
import { useTranslation } from 'react-i18next'

export interface EditorItemProps {
  name?: string
  onHeadingClick?: () => void
  onBackClick?: () => void
}

export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  const BackButton = () => {
    if (!props.onBackClick) return null
    const { t } = useTranslation()
    return (
      <Button
        title={t('back-to-list')}
        onClick={() => props.onBackClick && props.onBackClick()}
      >
        {t('back-to-list')}
      </Button>
    )
  }
  return (
    <React.Fragment>
      <HeadingBox onClick={() => props.onHeadingClick && props.onHeadingClick()}>
        <Columns spacing={1} layout={[6, 6]}>
          {props.name ? <Box>{props.name}</Box> : null}
          <Box sx={{ float: 'right' }}>
            <BackButton />
          </Box>
        </Columns>
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
