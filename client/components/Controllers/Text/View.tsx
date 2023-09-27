import Article from '../../Views/Article'
import Script from '../../Views/Script'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useStore } from './store'

export default function View() {
  const type = useStore((state) => state.record?.type)
  const outputedText = useStore((state) => state.outputedText)
  const View = type === 'script' ? Script : Article
  return (
    <ScrollBox sx={{ height: '100%' }}>
      <View text={outputedText} />
    </ScrollBox>
  )
}
