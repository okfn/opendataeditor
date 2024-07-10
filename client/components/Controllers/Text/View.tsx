import Article from '../../Views/Article'
import ScrollBox from '../../Parts/Boxes/Scroll'
import * as store from '@client/store'

export default function View() {
  const rendered = store.useStore((state) => state.text?.rendered)

  return (
    <ScrollBox sx={{ height: '100%' }}>
      <Article text={rendered} />
    </ScrollBox>
  )
}
