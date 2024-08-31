import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

export default styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} TransitionProps={{ timeout: 0 }} placement="right-start" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.OKFNBlue.main,
    color: theme.palette.common.black,
    boxShadow: theme.shadows[1],
    fontSize: 16,
    maxWidth: 500
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
}))
