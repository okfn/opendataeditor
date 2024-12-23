import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

interface AllTooltipProps extends TooltipProps {
  type?: string
}

export default styled(({ className, ...props }: AllTooltipProps) => (
  <Tooltip
    arrow
    {...props}
    classes={{ popper: className }}
    TransitionProps={{ timeout: 0 }}
    placement="bottom"
  />
))(({ theme, type }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor:
      type == 'fileMenu' ? theme.palette.OKFNCoolGray.main : theme.palette.common.white,
    color: type == 'fileMenu' ? theme.palette.common.white : 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 16,
    maxWidth: '50dvw',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.OKFNCoolGray.main,
  },
}))
