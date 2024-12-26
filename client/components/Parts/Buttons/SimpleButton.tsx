import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export const ButtonBgColor = {
  OKFNRed600: 'OKFNRed600',
  OKFNBlue: 'OKFNBlue',
} as const

export type ButtonBgColorType = keyof typeof ButtonBgColor

interface SimpleButtonProps extends ButtonProps {
  label?: string
  small?: boolean
  hoverBgColor?: ButtonBgColorType
}

export default function SimpleButton(props: SimpleButtonProps) {
  const { label, small, hoverBgColor, sx, ...others } = props

  const buttonTextColor = props.color === 'OKFNWhite' ? 'gray' : 'white'
  return (
    <Button
      fullWidth={!small}
      color={props.color}
      {...others}
      sx={{
        ...sx,
        padding: '14px 24px',
        borderRadius: '9px',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: (theme) =>
            hoverBgColor ? theme.palette[hoverBgColor].main : 'unset',
            borderColor: 'white'
        },
      }}
    >
      {
        <Typography
          sx={{
            textTransform: 'capitalize',
            fontWeight: 700,
            color: (theme) =>
              props.disabled ? theme.palette.OKFNGray700.main : buttonTextColor,
          }}
        >
          {label}
        </Typography>
      }
    </Button>
  )
}
