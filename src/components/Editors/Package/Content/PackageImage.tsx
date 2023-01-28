import React from 'react'
import InputField from '../../../Parts/Fields/InputField'
import Image from '../../../Parts/Image'
import { useStore } from '../store'
import noImage from '../../../Parts/assets/noImageIcon.png'
import { Box } from '@mui/system'

const PackageImage = () => {
  const url = useStore((state) => state.descriptor.imageUrl)

  return (
    <Box sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <ImageUrl />
      <Image
        url={url || noImage}
        description="Package Image"
        width="300px"
        height="300px"
      />
    </Box>
  )
}

export default PackageImage

const ImageUrl = () => {
  const url = useStore((state) => state.descriptor.imageUrl)
  const update = useStore((state) => state.update)
  const setElementName = useStore((state) => state.setElementName)
  return (
    <div style={{ width: '300px' }}>
      <InputField
        size="small"
        label="Image url"
        value={url}
        onChange={(newValue) => update({ imageUrl: newValue })}
        onFocus={() => setElementName('url')}
      />
    </div>
  )
}
