import * as React from 'react'
import Columns from '../Parts/Columns'
import Browser from './Browser'
import Content from './Content'
import Header from './Header'
import { useStore } from './store'
import WelcomeDialog from './Dialogs/WelcomeDialog'

export default function Layout() {
  const [isWelcome, setIsWelcome] = React.useState(false)
  const countFiles = useStore((state) => state.countFiles)
  React.useEffect(() => {
    countFiles()
      .then((result) => {
        if (result <= 0) return setIsWelcome(true)
        setIsWelcome(false)
      })
      .catch(console.error)
  }, [])
  return (
    <React.Fragment>
      <WelcomeDialog open={isWelcome} />
      <Header />
      <Columns layout={[3, 9]}>
        <Browser />
        <Content />
      </Columns>
    </React.Fragment>
  )
}
