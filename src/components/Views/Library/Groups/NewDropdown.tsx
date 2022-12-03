import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import UploadButton from '../Buttons/UploadButton'
import FolderButton from '../Buttons/FolderButton'
import PackageButton from '../Buttons/PackageButton'

interface NewDropdownProps {
  options: string[]
  variant?: 'contained' | 'outlined' | 'text'
  path?: string | undefined
  onFileUpload: (file: File) => void
  onCreateDataPackage: () => void
}

export default function NewButton(props: NewDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const handleCreatePackage = () => {
    setOpen(false)
    props.onCreateDataPackage()
  }

  const handleFileUpload = (file: File) => {
    setOpen(false)
    props.onFileUpload(file)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <React.Fragment>
      <ButtonGroup variant={props.variant} ref={anchorRef} aria-label="split button">
        <Button
          size="medium"
          aria-controls={open ? 'new-dropdown-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          + New
          <ArrowDropDownIcon />
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
                <MenuList id="new-dropdown-menu" autoFocusItem>
                  {props.options.map(
                    (option, index) =>
                      index !== 0 && (
                        <MenuItem key={option}>
                          <FolderButton
                            marginR={1}
                            show={index === 1}
                            closeMenu={() => setOpen(false)}
                          />
                          <UploadButton
                            marginR={1}
                            variant="text"
                            label={option}
                            show={index === 2}
                            onUpload={(file) => handleFileUpload(file)}
                          />
                          <PackageButton
                            marginR={1}
                            variant="text"
                            label={option}
                            show={index === 3}
                            disabled={!props.path}
                            onClick={() => handleCreatePackage()}
                          />
                        </MenuItem>
                      )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
