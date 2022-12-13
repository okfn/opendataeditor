import React from 'react'
import InputField from '../../Library/Fields/InputField'
import Image from '../../Library/Image'
import HeadingBox from '../../Library/Groups/HeadingBox'
import { useStore } from '../store'
import noImage from '../../Library/noImageIcon.png'
import { Box } from '@mui/system'

const PackageImage = () => {
  const url = useStore((state) => state.descriptor.imageUrl)

  return (
    <Box sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <HeadingBox>Package Image</HeadingBox>
      <ImageUrl />
      <div style={{ height: '300px', width: '300px', marginTop: '16px' }}>
        {url ? (
          <Image url={url} description="Package Image" />
        ) : (
          <Image url={noImage} description="Package Image" />
        )}
      </div>
    </Box>
  )
}

export default PackageImage

const ImageUrl = () => {
  const url = useStore((state) => state.descriptor.imageUrl)
  const update = useStore((state) => state.update)
  return (
    <div style={{ width: '300px' }}>
      <InputField
        size="medium"
        label="Image url"
        value={url}
        onChange={(newValue) => update({ imageUrl: newValue })}
      />
    </div>
  )
}
