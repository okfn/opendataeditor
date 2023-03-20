import * as React from 'react'
import Columns from '../Parts/Columns'
import Browser from './Browser'
import Content from './Content'
import Header from './Header'
import { useStore } from './store'
import WelcomeDialog from './Dialogs/WelcomeDialog'

export default function Layout() {
  const isWelcome = useStore((state) => state.isWelcome)
  const countFiles = useStore((state) => state.countFiles)
  React.useEffect(() => {
    countFiles().catch(console.error)
  }, [])
  return (
    <React.Fragment>
      <Header />
      {isWelcome ? (
        <WelcomeDialog />
      ) : (
        <Columns layout={[3, 9]}>
          <Browser />
          <Content />
        </Columns>
      )}
    </React.Fragment>
  )
}
