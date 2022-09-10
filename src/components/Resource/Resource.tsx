import * as React from 'react'
import { IResource } from '../../interfaces'
import { Provider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout, { LayoutWithTabs } from './Layout'

export interface ResourceProps {
  withTabs?: boolean
  resource?: IResource
  onCommit?: (resource: IResource) => void
  onRevert?: (resource: IResource) => void
}

export default function Resource(props: ResourceProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        {props.withTabs ? <LayoutWithTabs /> : <Layout />}
      </Provider>
    </ThemeProvider>
  )
}
