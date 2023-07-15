import * as React from 'react'
import EmptyFormat from './Empty'
import TableFormat from './Table'
import { useStore } from '../../store'

export default function Format() {
  const type = useStore((state) => state.type)
  switch (type) {
    case 'table':
      return <TableFormat />
    default:
      return <EmptyFormat />
  }
}
