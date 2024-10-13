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
  const [hoveredHotzone, setHoveredHotzone] = useState(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

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

    const handleKeyDown = (event) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
    
    const numRoutes = 36; // Increased for better coverage
    let routesCalculated = 0;
    const routes = [];

    for (let i = 0; i < numRoutes; i++) {
      const angle = (i / numRoutes) * 2 * Math.PI;
      const safeDistance = (hotzone.radius + 20) * 1000; // 20km beyond the hotzone radius
      const destination = {
        lat: origin.lat + (safeDistance / 111111) * Math.cos(angle),
        lng: origin.lng + (safeDistance / (111111 * Math.cos(origin.lat * Math.PI / 180))) * Math.sin(angle)
      };

      if (!isPointInAnyHotzone(destination)) {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            routesCalculated++;
            if (status === window.google.maps.DirectionsStatus.OK) {
              const emissions = calculateCarbonEmissions(result);
              routes.push({ route: result, emissions: emissions });
            }

            if (routesCalculated === numRoutes) {
              if (routes.length > 0) {
                const bestRoute = routes.reduce((min, route) => route.emissions < min.emissions ? route : min);
                setEvacuationRoute(bestRoute.route);
                setCarbonEmissions(bestRoute.emissions);
                setDirections(null);
              } else {
                alert("No safe evacuation routes found. Please try a different hotzone.");
              }
            }
          }
        );
      } else {
        routesCalculated++;
      }
    }
  };

  const isPointInAnyHotzone = (point) => {
    return hotzoneData.some(hotzone => {
      const distance = getDistance(point, hotzone.location);
      return distance <= hotzone.radius * 1000;
    });
  };

  const getDistance = (p1, p2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = p1.lat * Math.PI / 180;
    const φ2 = p2.lat * Math.PI / 180;
    const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
    const Δλ = (p2.lng - p1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const calculateCarbonEmissions = (route) => {
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
            onMouseOver={() => isCtrlPressed && setHoveredHotzone(hotzone)}
            onMouseOut={() => setHoveredHotzone(null)}
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
        {hoveredHotzone && isCtrlPressed && (
          <InfoWindow
            position={hoveredHotzone.location}
            onCloseClick={() => setHoveredHotzone(null)}
          >
            <div className='text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-4'>
              <p><strong>Reports:</strong> {hoveredHotzone.count}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default HurricaneHotzoneComponent;