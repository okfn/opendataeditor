import * as React from 'react'
import { useStore } from './store'
import ForeignKeys from './ForeignKeys'
import ForeignKey from './ForeignKey'
import Fields from './Fields'
import Field from './Field'

export default function Page() {
  const page = useStore((state) => state.page)
  switch (page) {
    case 'foreignKeys':
      return <ForeignKeys />
    case 'foreignKey':
      return <ForeignKey />
    case 'fields':
      return <Fields />
    case 'field':
      return <Field />
    default:
      return null
  }
}
