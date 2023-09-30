import SpinnerCard from '../../Parts/Cards/Spinner'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
// import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Viewer() {
  const loader = useStore((state) => state.loader)
  return (
    <InovuaDatagrid
      dataSource={loader}
      pagination={true}
      loadingText={<Typography>Loading...</Typography>}
      renderLoadMask={LoadMask}
      defaultActiveCell={[0, 1]}
      style={{ height: '100%', border: 'none' }}
    />
  )
}

function LoadMask(props: { visible: boolean; zIndex: number }) {
  if (!props.visible) return null
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        opacity: 0.6,
        background: 'rgba(121, 134, 203, 0.25)',
        zIndex: props.zIndex,
      }}
    >
      <SpinnerCard message="Loading" />
    </Box>
  )
}
