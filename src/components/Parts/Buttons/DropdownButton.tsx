import * as React from 'react'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { styled } from '@mui/material/styles'

interface DropdownButtonProps {
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  children?: React.ReactNode
  open?: boolean
}

export default function DropdownButton(props: DropdownButtonProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => setOpen(props.open ?? open), [props.open])
  const handleToggle = () => setOpen(!open)
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }
  // TODO: replace height 100% by a normal solution (issue #90)
  return (
    <React.Fragment>
      <ButtonGroup
        fullWidth
        sx={{ height: '100%' }}
        variant={props.variant}
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          onClick={handleToggle}
          disabled={props.disabled}
          aria-controls={open ? 'new-dropdown-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
        >
          {props.icon} {props.label}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        onClick={handleToggle}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenuList autoFocusItem>
                  {React.Children.map(props.children, (child, index) => (
                    <StyledMenuItem key={index}>{child}</StyledMenuItem>
                  ))}
                </StyledMenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
const StyledMenuList = styled(MenuList)({
  padding: 0,
})
const StyledMenuItem = styled(MenuItem)({
  padding: 0,
  '& button': { padding: '8px 12px', justifyContent: 'left' },
  '& label': { padding: '8px 12px', justifyContent: 'left' },
})
