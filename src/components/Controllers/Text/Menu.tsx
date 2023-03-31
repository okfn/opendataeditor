import * as React from 'react'
import MenuBar, { MenuBarItem } from '../../Parts/Bars/Menu'
import { useStore, selectors } from './store'

export default function Menu() {
  const language = useStore(selectors.language)
  const clear = useStore((state) => state.clear)
  const fix = useStore((state) => state.fix)
  const minify = useStore((state) => state.minify)
  const prettify = useStore((state) => state.prettify)
  const items: MenuBarItem[] = ['clear']
  if (language === 'json') items.push('fix', 'minify', 'prettify')
  return (
    <MenuBar
      items={items}
      onClear={clear}
      onFix={fix}
      onMinify={minify}
      onPrettify={prettify}
    />
  )
}
