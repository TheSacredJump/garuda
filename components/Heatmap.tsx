import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, CircleF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const floridaCenter = {
  lat: 27.6648,
  lng: -81.5158
};

const HurricaneHotzoneComponent = () => {
  const [hotzoneData, setHotzoneData] = useState([]);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const fetchHotzoneData = async () => {
      try {
        const response = await fetch('https://71ca-67-134-204-43.ngrok-free.app/heatmap');
        const data = await response.json();
        setHotzoneData(data);
      } catch (error) {
        console.error('Error fetching hotzone data:', error);
      }
    };

    fetchHotzoneData();
  }, []);

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(24.396308, -87.634896)); // Southwest corner of Florida
    bounds.extend(new window.google.maps.LatLng(31.000888, -79.974306)); // Northeast corner of Florida
    map.fitBounds(bounds);
  };

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={floridaCenter}
        zoom={7}
        onLoad={onMapLoad}
      >
        {hotzoneData.map((hotzone, index) => (
          <CircleF
            key={index}
            center={{
              lat: hotzone.location.lat,
              lng: hotzone.location.lng
            }}
            radius={hotzone.radius * 1000} // Adjust this multiplier to make circles more visible
            options={{
              fillColor: hotzone.color,
              fillOpacity: 0.7,
              strokeColor: hotzone.color,
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default HurricaneHotzoneComponent;