import * as React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { useStore } from './store'

export default function Query() {
  const query = useStore((state) => state.view.query)
  const setQuery = useStore((state) => state.setQuery)
  const formatQuery = useStore((state) => state.formatQuery)
  const validateQuery = useStore((state) => state.validateQuery)
  const viewError = useStore((state) => state.viewError)
  const aceEditor = React.useRef<AceEditor>(null)
  const theme = useTheme()

  return (
    <Box>
      {viewError ? (
        <Alert sx={{ marginTop: 2 }} severity="error">
          {viewError?.message}
        </Alert>
      ) : (
        ''
      )}
      <Box sx={{ margin: 2 }}>
        <InputLabel htmlFor="sql-editor">SQL Query</InputLabel>
        <AceEditor
          ref={aceEditor}
          mode="sql"
          width="100%"
          height={theme.spacing(24)}
          name="sql-editor"
          value={query}
          theme="github"
          onChange={(query) => setQuery(query)}
          setOptions={{
            showLineNumbers: false,
            showGutter: false,
            fontSize: '20px',
            enableBasicAutocompletion: true,
          }}
        />
        <Stack spacing={2} direction="row">
          <Button size="small" variant="contained" onClick={validateQuery}>
            Validate SQL
          </Button>
          <Button size="small" variant="contained" onClick={formatQuery}>
            Format SQL
          </Button>
        </Stack>
        <FormHelperText sx={{ marginTop: '10px' }}>
          You can type a SQL query to select part of the data in your resources
        </FormHelperText>
      </Box>
    </Box>
  )
}
