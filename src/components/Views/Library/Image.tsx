import { noop } from 'lodash'
import * as React from 'react'

interface ImageProps {
  url: string | undefined
  description: string
  width: string
  height: string
  onFocus?: (event: any) => void
}

export default function Image(props: ImageProps) {
  const onFocus = props.onFocus || noop
  return (
    <img
      src={props.url}
      alt={props.description}
      onFocus={onFocus}
      width={props.width}
      height={props.height}
    />
  )
}
