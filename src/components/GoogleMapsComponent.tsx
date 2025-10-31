'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

declare global {
  interface Window {
    google: any
  }
}

interface MapProps {
  center: { lat: number; lng: number }
  zoom: number
  incidents: Array<{
    id: number
    type: string
    location: string
    priority: string
    time: string
    officer: string
    coordinates?: { lat: number; lng: number }
  }>
}

interface MarkerProps {
  position: { lat: number; lng: number }
  title: string
  type: string
  priority: string
  map: any
}

const Marker: React.FC<MarkerProps> = ({ position, title, type, priority, map }) => {
  const markerRef = useRef<any>()

  useEffect(() => {
    if (!markerRef.current) {
      // Create marker with custom icon based on priority
      const getMarkerIcon = (priority: string) => {
        const color = priority === 'high' ? '#ef4444' : 
                     priority === 'medium' ? '#f59e0b' : '#10b981'
        
        return {
          path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
          scale: 8,
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      }

      markerRef.current = new window.google.maps.Marker({
        position,
        map,
        title,
        icon: getMarkerIcon(priority)
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
              ${type}
            </h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">
              <strong>Байршил:</strong> ${title}
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              <strong>Яаралтай байдал:</strong> 
              <span style="color: ${priority === 'high' ? '#ef4444' : 
                                   priority === 'medium' ? '#f59e0b' : '#10b981'}">
                ${priority === 'high' ? 'Яаралтай' : 
                  priority === 'medium' ? 'Дундаж' : 'Бага'}
              </span>
            </p>
          </div>
        `
      })

      markerRef.current.addListener('click', () => {
        infoWindow.open(map, markerRef.current)
      })
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [position, title, type, priority, map])

  return null
}

const MapComponent: React.FC<MapProps> = ({ center, zoom, incidents }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>()

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [ref, map, center, zoom])

  return (
    <div className="w-full h-full">
      <div ref={ref} className="w-full h-full min-h-[400px] rounded-lg map-container" />
      {map &&
        incidents
          .filter(incident => incident.coordinates)
          .map((incident) => (
            <Marker
              key={incident.id}
              position={incident.coordinates!}
              title={incident.location}
              type={incident.type}
              priority={incident.priority}
              map={map}
            />
          ))
      }
    </div>
  )
}

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Google Maps ачааллаж байна...</p>
        </div>
      </div>
    )
  }
  if (status === Status.FAILURE) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center text-red-600 p-6">
          <h3 className="font-semibold text-lg mb-2">Google Maps ачаалахад алдаа гарлаа</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Шалтгаан:</p>
            <ul className="text-left space-y-1">
              <li>• API түлхүүр буруу эсвэл хүчингүй</li>
              <li>• Maps JavaScript API идэвхжүүлэгдээгүй</li>
              <li>• Домайн хязгаарлалт тохиргоо</li>
              <li>• Интернет холболт алдаа</li>
            </ul>
            <p className="mt-3">
              <strong>Шийдэл:</strong> GOOGLE_MAPS_SETUP.md файлыг үзнэ үү
            </p>
          </div>
        </div>
      </div>
    )
  }
  return <div></div>
}

interface GoogleMapsComponentProps {
  incidents: Array<{
    id: number
    type: string
    location: string
    priority: string
    time: string
    officer: string
  }>
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({ incidents }) => {
  // Улаанбаатар хотын координат
  const center = { lat: 47.9077, lng: 106.8832 }
  const zoom = 11

  // Add coordinates for incidents based on location
  const incidentsWithCoordinates = incidents.map(incident => {
    let coordinates: { lat: number; lng: number } | undefined

    // Дүүргүүдийн ойролцоо координатууд
    switch (incident.location) {
      case 'Баянзүрх дүүрэг':
        coordinates = { lat: 47.9138, lng: 106.9616 }
        break
      case 'Хан-Уул дүүрэг':
        coordinates = { lat: 47.8864, lng: 106.9678 }
        break
      case 'Сүхбаатар дүүрэг':
        coordinates = { lat: 47.9186, lng: 106.9225 }
        break
      case 'Чингэлтэй дүүрэг':
        coordinates = { lat: 47.9077, lng: 106.8832 }
        break
      case 'Сонгинохайрхан дүүрэг':
        coordinates = { lat: 47.9077, lng: 106.7866 }
        break
      default:
        // Random coordinates within Ulaanbaatar if location not recognized
        coordinates = {
          lat: 47.9077 + (Math.random() - 0.5) * 0.1,
          lng: 106.8832 + (Math.random() - 0.5) * 0.1
        }
    }

    return { ...incident, coordinates }
  })

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}
      render={render}
      libraries={['marker']}
    >
      <MapComponent
        center={center}
        zoom={zoom}
        incidents={incidentsWithCoordinates}
      />
    </Wrapper>
  )
}

export default GoogleMapsComponent
