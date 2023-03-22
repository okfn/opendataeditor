import * as React from 'react'
import HeadingBox from './Internals/HeadingBox'

export interface EditorItemProps {
  name: string
  onHeadingClick?: () => void
}

export default function EditorItem(props: React.PropsWithChildren<EditorItemProps>) {
  return (
    <React.Fragment>
      <HeadingBox onClick={() => props.onHeadingClick && props.onHeadingClick()}>
        {props.name}
      </HeadingBox>
      {props.children}
    </React.Fragment>
  )
}
