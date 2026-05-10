'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

interface College {
  id: string
  name: string
  city: string
  state: string
  rating: number
  type: string
  website?: string
  latitude: number
  longitude: number
}

interface Props {
  colleges: College[]
  selectedCollegeId?: string
}

const INDIA_CENTER: [number, number] = [20.5937, 78.9629]

export default function LeafletCollegesMap({ colleges, selectedCollegeId }: Props) {
  const validColleges = colleges.filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude))
  const selectedCollege = validColleges.find((c) => c.id === selectedCollegeId)

  const center: [number, number] = selectedCollege
    ? [selectedCollege.latitude, selectedCollege.longitude]
    : INDIA_CENTER

  const zoom = selectedCollege ? 12 : 5

  return (
    <MapContainer center={center} zoom={zoom} className="h-full w-full rounded-lg" scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validColleges.map((college) => (
        <CircleMarker
          key={college.id}
          center={[college.latitude, college.longitude]}
          radius={selectedCollegeId === college.id ? 10 : 7}
          pathOptions={{
            color: selectedCollegeId === college.id ? '#1d4ed8' : '#2563eb',
            fillColor: selectedCollegeId === college.id ? '#1e40af' : '#3b82f6',
            fillOpacity: 0.75,
            weight: 2,
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <div className="font-semibold text-slate-900">{college.name}</div>
              <div className="text-xs text-slate-600 mt-1">{college.city}, {college.state}</div>
              <div className="text-xs mt-1">Rating: {college.rating} • {college.type}</div>
              {college.website ? (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline mt-2 inline-block"
                >
                  Visit website
                </a>
              ) : null}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
