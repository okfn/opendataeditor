import * as React from 'react'
import Describe from './Pages/Describe'
import Extract from './Pages/Extract'
import Validate from './Pages/Validate'
import Transform from './Pages/Transform'
import Home from './Pages/Home'
import { useStore } from './store'

export default function Page() {
  const page = useStore((state) => state.page)
  switch (page) {
    case 'describe':
      return <Describe />
    case 'extract':
      return <Extract />
    case 'validate':
      return <Validate />
    case 'transform':
      return <Transform />
    default:
      return <Home />
  }
}
