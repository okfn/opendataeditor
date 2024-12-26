import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '../../Parts/Icons/DeleteIcon'

interface EditorListItemProps {
  kind: string
  name: string
  type?: string
  title?: string
  disabled?: boolean
  onClick?: () => void
  onRemoveClick?: () => void
}

export default function EditorListItem(props: EditorListItemProps) {
  const theme = useTheme()

  const { t } = useTranslation()

  const RemoveButton = () => {
    if (!props.onRemoveClick) return null

    return (
      <Button
        size="small"
        color="warning"
        component="span"
        title={`${t('remove')} ${capitalize(props.kind)}`}
        sx={{
          '& svg': {
            width: '22px',
            '&:hover': {
              fill: (theme) => theme.palette.OKFNRed500.main,
            },
          },
        }}
        onClick={(ev) => {
          ev.stopPropagation()
          props.onRemoveClick?.()
        }}
      >
        <DeleteIcon color="OKFNGray700" />
      </Button>
    )
  }

  const EndIcon = () => {
    return (
      <Box>
        <RemoveButton />
      </Box>
    )
  }

  const label = props.type || 'item'
  return (
    <Button
      size="large"
      variant="outlined"
      endIcon={props.type ? <EndIcon /> : null}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      disabled={props.disabled}
      title={props.title || `Edit ${capitalize(props.kind)}`}
      sx={{
        width: '100%',
        margin: '8px 0',
        justifyContent: 'space-between',
        textTransform: 'capitalize',
        padding: '12px 16px',
        whiteSpace: 'nowrap',
        borderColor: '#E6E7EB',
        animation: 'highlight 3s ease-in-out',
        '@keyframes highlight': {
          '0%': {
            borderColor: (theme) => theme.palette.OKFNBlue.main,
          },
          '100%': {
            borderColor: '#E6E7EB',
          },
        },
        '&:hover': {
          borderColor: (theme) => theme.palette.OKFNBlue.main,
        },
      }}
    >
      <span
        style={{
          textAlign: 'left',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          color: theme.palette.OKFNGray700.main,
          fontWeight: 600,
        }}
      >
        {props.name}
      </span>
      <Typography
        sx={{
          backgroundColor: '#FAFAFA',
          border: '1px solid #D3D7D8',
          padding: '4px 10px',
          fontSize: '14px',
          color: (theme) => theme.palette.OKFNGray700.main,
          marginRight: 'auto',
          marginLeft: '10px',
        }}
        component="span"
      >
        {props.kind === 'foreign key' || props.kind === 'field'
          ? label.toUpperCase()
          : label}
      </Typography>
    </Button>
  )
}
