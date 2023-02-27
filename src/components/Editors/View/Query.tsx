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
import { useStore } from './store'

export default function Query() {
  const query = useStore((state) => state.view.query)
  const setQuery = useStore((state) => state.setQuery)
  const formatQuery = useStore((state) => state.formatQuery)
  const viewError = useStore((state) => state.viewError)
  const aceEditor = React.useRef<AceEditor>(null)

  const formatSQL = () => {
    formatQuery()
  }

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
          height="40px"
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
        <Button size="small" variant="contained" onClick={formatSQL}>Format SQL</Button>
        <FormHelperText sx={{ marginTop: '10px'}}>
          You can type a SQL query to select part of the data in your resources
        </FormHelperText>
      </Box>
    </Box>
  )
}
