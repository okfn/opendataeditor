import * as React from 'react'

interface ImageProps {
  url: string | undefined
  description: string
}
const Image: React.FC<ImageProps> = ({ url, description }) => {
  const fitcontent = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  } as React.CSSProperties
  return <img src={url} alt={description} style={fitcontent} />
}

export default Image
