import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, CircleF, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

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
  const [userLocation, setUserLocation] = useState(null);
  const [selectedHotzone, setSelectedHotzone] = useState(null);
  const [directions, setDirections] = useState(null);
  const [evacuationRoute, setEvacuationRoute] = useState(null);
  const [carbonEmissions, setCarbonEmissions] = useState(null);

  useEffect(() => {
    const fetchHotzoneData = async () => {
      try {
        const response = await fetch('https://61db-192-54-222-129.ngrok-free.app/heatmap');
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
    bounds.extend(new window.google.maps.LatLng(24.396308, -87.634896));
    bounds.extend(new window.google.maps.LatLng(31.000888, -79.974306));
    map.fitBounds(bounds);
  };

  const handleHotzoneClick = (hotzone) => (e) => {
    if (e.placeId) return; // Ignore clicks on POIs
    if (window.event.shiftKey) {
      calculateEvacuationRoute(hotzone);
    } else {
      setSelectedHotzone(hotzone);
      if (userLocation) {
        calculateDirections(userLocation, hotzone.location);
      } else {
        alert("Please add your location first by clicking on the map.");
      }
    }
  };

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setUserLocation(clickedLocation);
    if (selectedHotzone) {
      calculateDirections(clickedLocation, selectedHotzone.location);
    }
  };

  const calculateDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setEvacuationRoute(null); // Clear evacuation route when showing directions
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const calculateEvacuationRoute = (hotzone) => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = hotzone.location;
    
    // Calculate multiple points outside the hotzone
    const numRoutes = 5;
    const routes = [];

    for (let i = 0; i < numRoutes; i++) {
      const angle = (i / numRoutes) * 2 * Math.PI;
      const safeDistance = (hotzone.radius + 5) * 1000; // 5km beyond the hotzone radius
      const destination = {
        lat: origin.lat + (safeDistance / 111111) * Math.cos(angle),
        lng: origin.lng + (safeDistance / (111111 * Math.cos(origin.lat * Math.PI / 180))) * Math.sin(angle)
      };

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const emissions = calculateCarbonEmissions(result);
            routes.push({ route: result, emissions: emissions });

            if (routes.length === numRoutes) {
              // All routes calculated, choose the one with lowest emissions
              const bestRoute = routes.reduce((min, route) => route.emissions < min.emissions ? route : min);
              setEvacuationRoute(bestRoute.route);
              setCarbonEmissions(bestRoute.emissions);
              setDirections(null); // Clear regular directions when showing evacuation route
            }
          } else {
            console.error(`error fetching evacuation route ${result}`);
          }
        }
      );
    }
  };

  const calculateCarbonEmissions = (route) => {
    // This is a simplified calculation. In a real-world scenario, you'd want to use more accurate data and calculations.
    const distance = route.routes[0].legs[0].distance.value / 1000; // distance in km
    const emissionFactor = 0.12; // kg CO2 per km (average car emission)
    return distance * emissionFactor;
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
        onClick={handleMapClick}
      >
        {hotzoneData.map((hotzone, index) => (
          <CircleF
            key={index}
            center={{
              lat: hotzone.location.lat,
              lng: hotzone.location.lng
            }}
            radius={hotzone.radius * 1000}
            options={{
              fillColor: hotzone.color,
              fillOpacity: 0.7,
              strokeColor: hotzone.color,
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
            onClick={handleHotzoneClick(hotzone)}
          />
        ))}
        {userLocation && (
          <Marker
            position={userLocation}
            label="You"
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "blue",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {evacuationRoute && (
          <>
            <DirectionsRenderer
              directions={evacuationRoute}
              options={{
                polylineOptions: {
                  strokeColor: "green",
                  strokeWeight: 5,
                },
              }}
            />
            <InfoWindow
              position={evacuationRoute.routes[0].legs[0].start_location}
            >
              <div className='text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-4'>
                <h3 className='font-bold mb-2'>Evacuation Route</h3>
                <p className='mb-1'><span className='font-medium'>Carbon Emissions:</span> {carbonEmissions.toFixed(2)} kg CO2</p>
                <p>This is the route with the <span className='font-medium'>lowest</span> carbon emissions.</p>
              </div>
            </InfoWindow>
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default HurricaneHotzoneComponent;