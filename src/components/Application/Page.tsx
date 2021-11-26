import * as React from 'react'
import Home from './Pages/Home'
import Config from './Pages/Config'
import Describe from './Pages/Describe'
import Extract from './Pages/Extract'
import Validate from './Pages/Validate'
import Transform from './Pages/Transform'
import { useStore } from './store'

export default function Page() {
  const page = useStore((state) => state.page)
  switch (page) {
    case 'home':
      return <Home />
    case 'config':
      return <Config />
    case 'describe':
      return <Describe />
    case 'extract':
      return <Extract />
    case 'validate':
      return <Validate />
    case 'transform':
      return <Transform />
    default:
      return null
  }
}
