import * as React from 'react'
import Data from './Data'
import Help from './Help'
import Config from './Config'
import { useStore } from '../store'

export default function Content() {
  const contentType = useStore((state) => state.contentType)
  switch (contentType) {
    case 'help':
      return <Help />
    case 'config':
      return <Config />
    case 'data':
      return <Data />
    default:
      return null
  }
}
