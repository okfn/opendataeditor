import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import UploadButton from '../Buttons/UploadButton'
import CreateDirectoryButton from '../Buttons/CreateDirectoryButton'

interface EditorDropDownButtonProps {
  options: string[]
  variant?: 'contained' | 'outlined' | 'text'
  path?: string | undefined
  onFileUpload: (file: File) => void
  onCreateDataPackage: () => void
}

export default function EditorDropDownButton(props: EditorDropDownButtonProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const handleButtonClick = (index: number) => {
    if (index === 3) {
      props.onCreateDataPackage()
    }
    setOpen(false)
  }

  const handleFileUpload = (file: File) => {
    console.log('handle upload')
    props.onFileUpload(file)
    setOpen(false)
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
          aria-controls={open ? 'split-button-menu' : undefined}
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
                <MenuList id="split-button-menu" autoFocusItem>
                  {props.options.map(
                    (option, index) =>
                      index !== 0 && (
                        <MenuItem key={option}>
                          {index === 1 && <CreateDirectoryButton />}
                          {index === 2 && (
                            <UploadButton
                              variant="text"
                              label={option}
                              displayIcon={true}
                              onUpload={(file) => handleFileUpload(file)}
                            />
                          )}
                          {index === 3 && (
                            <Button
                              disabled={!props.path}
                              variant="text"
                              component="label"
                              onClick={() => handleButtonClick(index)}
                            >
                              <CreateNewFolderIcon />
                              {option}
                            </Button>
                          )}
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
