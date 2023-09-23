import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../Parts/Fields/Select'
import Columns from '../Parts/Grids/Columns'
import * as menu from '../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const folder = useStore((state) => state.config?.folder)
  const openProject = useStore((state) => state.openProject)
  if (!folder) return
  const name = folder.split(/[\\/]/g).slice(-1)[0]
  // @ts-ignore
  const selectFolder = window?.opendataeditor?.selectFolder
  const handleOpen = async () => {
    if (!selectFolder) return
    const fullpath = await selectFolder()
    if (fullpath) await openProject(fullpath)
  }
  return (
    <menu.MenuBar fullWidth>
      <Columns layout={[9, 3]} spacing={1}>
        <SelectField
          margin="none"
          value={name}
          options={[name, folder]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" disableTypography>
                Project:
              </InputAdornment>
            ),
          }}
        />
        <Button
          color="inherit"
          variant="outlined"
          fullWidth
          onClick={handleOpen}
          sx={{ height: '100%', borderColor: '#bbb !important' }}
        >
          Open
        </Button>
      </Columns>
    </menu.MenuBar>
  )
}
