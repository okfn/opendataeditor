import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Columns from '../../Parts/Grids/Columns'
import HeadingBox from './Heading/Box'
import EditorListItem from './ListItem'
import startCase from 'lodash/startCase'

export interface EditorListProps {
  kind: string
  query?: string
  onAddClick?: (() => void) | null
  // We accept search as a prop otherwise it loses focus
  SearchInput?: React.ReactNode
}

export default function EditorList(props: React.PropsWithChildren<EditorListProps>) {
  const { t } = useTranslation()
  const AddButton = () => {
    if (!props.onAddClick) return null

    return (
      <Button
        sx={{
          textTransform: 'capitalize',
          backgroundColor: (theme) => theme.palette.OKFNGray700.main,
          color: 'white',
          padding: '4px 10px',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.OKFNBlue.main,
          },
        }}
        title={`Add ${startCase(props.kind)}`}
        onClick={() => props.onAddClick?.()}
      >
        Add {startCase(props.kind)}
      </Button>
    )
  }

  // @ts-ignore
  const title = t(`${props.kind.replace(' ', '-')}s`) as any

  // TODO: we can make HeadingBox (or with Tabs/Help) "sticky" with CSS:
  // https://developer.mozilla.org/en-US/docs/Web/CSS/position
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={props.SearchInput ? [4, 5, 3] : [6, 6]}>
          <Box sx={{ whiteSpace: 'nowrap' }}>{title}</Box>
          <Box sx={{ float: 'right' }}>
            <AddButton />
          </Box>
          {props.SearchInput}
        </Columns>
      </HeadingBox>
      {React.Children.count(props.children) > 0 ? (
        props.children
      ) : (
        <EditorListItem
          disabled
          kind={props.kind}
          name={`No ${title.toLowerCase()} ${props.query ? t('found') : t('added')}`}
        />
      )}
    </React.Fragment>
  )
}
