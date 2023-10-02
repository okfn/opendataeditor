// NOTE: there is a bug showing tooltips; it's a fix
import 'leaflet/dist/images/marker-shadow.png'
import * as React from 'react'
import Box from '@mui/material/Box'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import * as topojson from 'topojson-client'

export interface MapProps {
  text?: string
}

export default function Map(props: MapProps) {
  const [geo, setGeo] = React.useState<any>(null)
  const [map, setMap] = React.useState<any>(null)
  React.useEffect(() => {
    if (map && geo) map.fitBounds(geo.getBounds())
  }, [map, geo, props.text])
  if (!props.text) return null
  let data = JSON.parse(props.text)
  if (data?.type === 'Topology') {
    data = topojson.feature(data, Object.keys(data.objects)[0] as any)
  }
  return (
    <Box
      sx={{
        padding: 2,
        width: '100%',
        height: '100%',
        '& > .leaflet-container': { height: '100%' },
      }}
    >
      <MapContainer center={[50, 0]} zoom={5} ref={setMap as any}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={data}
          key={props.text}
          ref={setGeo as any}
          onEachFeature={(feature, layer) => {
            const pairs = Object.entries(feature.properties)
            const items = pairs.map((p) => `<div><strong>${p[0]}</strong>: ${p[1]}</div>`)
            layer.bindPopup(items.join(''))
          }}
        />
      </MapContainer>
    </Box>
  )
}
