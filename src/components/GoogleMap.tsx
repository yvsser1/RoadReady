import React, { useEffect, useRef } from 'react'

interface GoogleMapProps {
  address: string
}

declare global {
  interface Window {
    google: any
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const googleMapScript = document.createElement('script')
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`
    googleMapScript.async = true
    window.document.body.appendChild(googleMapScript)

    googleMapScript.addEventListener('load', () => {
      if (mapRef.current) {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ address: address }, (results: any, status: any) => {
          if (status === 'OK') {
            const map = new window.google.maps.Map(mapRef.current, {
              center: results[0].geometry.location,
              zoom: 15,
            })
            new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            })
          } else {
            console.error('Geocode was not successful for the following reason: ' + status)
          }
        })
      }
    })

    return () => {
      window.document.body.removeChild(googleMapScript)
    }
  }, [address])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}

export default GoogleMap

