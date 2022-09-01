import * as React from 'react'
import omit from 'lodash/omit'
import { IFile } from './interfaces/file'

// TODO: remove React dependency from helpers
export function useAsyncReducer(reducer: any, initialState: any) {
  const [state, setState] = React.useState(initialState)
  const dispatchState = async (action: any) => setState(await reducer(state, action))
  return [state, dispatchState]
}

export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}

export async function request(
  path: string,
  props: { [key: string]: any; file?: IFile } = {}
) {
  const method = 'POST'
  let headers
  let body
  if (props.file) {
    body = new FormData()
    body.append('file', new Blob([props.file.bytes]), props.file.name)
    body.append('detector', JSON.stringify(omit(props, 'file')))
  } else {
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    body = JSON.stringify(props)
  }
  const response = await fetch(path, { method, headers, body })
  return response.json()
}
