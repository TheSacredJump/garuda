import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, CircleF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 30,
  lng: -40
};

const HurricaneHotzoneComponent = () => {
  const [hotzoneData, setHotzoneData] = useState([]);

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

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAZf90eGMLiyI-bskPYrYpSjb9eE9bvnpE"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={3}
      >
        {hotzoneData.map((hotzone, index) => (
          <CircleF
            key={index}
            center={{
              lat: hotzone.location.lat,
              lng: hotzone.location.lng
            }}
            radius={hotzone.radius * 10000} // Adjust this multiplier to make circles more visible
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