import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface SimpleButtonProps extends ButtonProps {
  label?: string
  small?: boolean
}

export default function SimpleButton(props: SimpleButtonProps) {
  const { label, small, ...others } = props
  return (
    <Button
      fullWidth={!props.small}
      color={props.color}
      {...others}
    >
      {small ? (
        <Typography sx={{ fontWeight: 300, textTransform: 'capitalize' }}>
          {label}
        </Typography>
      ) : (
        label
      )}
    </Button>
  )
}
