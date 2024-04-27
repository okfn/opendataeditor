import Image from '../../Views/Image'
import Map from '../../Views/Map'
import Missing from '../../Views/Missing'
import NoteDialog from '../../Parts/Dialogs/Note'
import { useStore } from './store'

export default function View() {
  const type = useStore((state) => state.record?.type)
  const format = useStore((state) => state.record?.resource.format)
  const byteSource = useStore((state) => state.byteSource)
  const textSource = useStore((state) => state.textSource)

  const updateState = useStore((state) => state.updateState)

  if (!type) return null
  if (type === 'image') return <Image format={format} bytes={byteSource} />
  if (type === 'map') return <Map text={textSource} />
  // return <Missing format={format} />
  // return <NoteDialog
  //     open={true}
  //     title="Unsupported format"
  //     label="OK"
  //     description={`The format ${format} is not supported by the application. \n\n The supported formats are ${supportedFormats.join(', ').toUpperCase()}`}
  //     onConfirm={() => updateState({ dialog: undefined })}
  //   />
  return;
}
