import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface SimpleButtonProps extends ButtonProps {
  label?: string
  small?: boolean
}

export default function SimpleButton(props: SimpleButtonProps) {
  const { label, ...others } = props

  const buttonTextColor = props.color === 'OKFNWhite' ? 'gray': 'white'
  return (
    <Button
      fullWidth={!props.small}
      color={props.color}
      {...others}
    >
      {(
        <Typography sx={{ textTransform: 'capitalize', fontWeight: 600, color: buttonTextColor }}>
          {label}
        </Typography>
      )}
    </Button>
  )
}
