import * as React from 'react'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function CreateArticleDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createArticle = useStore((state) => state.createArticle)
  const updateState = useStore((state) => state.updateState)
  const path = folderPath ? `${folderPath}/article.md` : 'article.md'
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create Article"
      label="Create"
      description="You are creating a Markdown article. Enter destination:"
      placholder="Enter an article path"
      Icon={HistoryEduIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createArticle(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
