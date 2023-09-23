import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../Parts/Fields/Select'
import Columns from '../Parts/Grids/Columns'
import * as menu from '../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const name = useStore((state) => state.config?.project.name || 'current')
  const openProject = useStore((state) => state.openProject)
  // @ts-ignore
  const selectFolder = window?.opendataeditor?.selectFolder
  const handleOpen = async () => {
    if (!selectFolder) return
    const fullpath = await selectFolder()
    await openProject(fullpath)
  }
  return (
    <menu.MenuBar fullWidth>
      <Columns layout={[9, 3]} spacing={1}>
        <SelectField
          disabled={!selectFolder}
          margin="none"
          value={name}
          options={[name]}
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
          disabled={!selectFolder}
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
