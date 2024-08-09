import NoteDialog from '../../Parts/Dialogs/Note'

export default function CloseDesktopAppDialog() {
  const onNote = async () => {
    // @ts-ignore
    window?.opendataeditor?.closeDesktopApp()
  }

  return (
    <NoteDialog
      open={true}
      title="Closing Application"
      label="OK"
      description="The application will be closed now"
      onCancel={onNote}
      onConfirm={onNote}
    />
  )
}
