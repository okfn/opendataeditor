import * as React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { useStore } from './store'

export default function Query() {
  const query = useStore((state) => state.view.query)
  const setQuery = useStore((state) => state.setQuery)
  const viewError = useStore((state) => state.viewError)

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
          mode="sql"
          width="100%"
          height="40px"
          name="sql-editor"
          value={query}
          theme="github"
          onChange={(query) => setQuery(query)}
          setOptions={{ showLineNumbers: false, showGutter: false, fontSize: '20px' }}
        />
        <FormHelperText>
          You can type a SQL query to select part of the data in your resources
        </FormHelperText>
      </Box>
    </Box>
  )
}
